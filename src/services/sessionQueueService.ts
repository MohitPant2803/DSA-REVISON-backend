import mongoose, { Types } from 'mongoose';
import SessionQueue, { ISessionQueue } from '../models/sessionQueue.model';
import Folder from '../models/folder.model';
import Playlist from '../models/playlist.model';
import UserCardState from '../models/userCardState.model';
import RevisionCard from '../models/revisionCard.model';
import UserQuestionProgress from '../models/userQuestionProgress.model';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const SMART_PLAYLIST_MAP: Record<string, string> = {
  easy: '000000000000000000000001',
  medium: '000000000000000000000002',
  hard: '000000000000000000000003',
  skipped: '000000000000000000000004',
};

const REVERSE_SMART_PLAYLIST_MAP: Record<string, string> = {
  '000000000000000000000001': 'easy',
  '000000000000000000000002': 'medium',
  '000000000000000000000003': 'hard',
  '000000000000000000000004': 'skipped',
};

// Helper to shuffle a copy of an array (Fisher-Yates Shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Helper to recursively fetch child folders and all revision cards matching those folders in order
const getFolderCardIdsRecursively = async (
  folderId: mongoose.Types.ObjectId | string
): Promise<mongoose.Types.ObjectId[]> => {
  const rootId = typeof folderId === 'string' ? new Types.ObjectId(folderId) : folderId;
  const rootFolder = await Folder.findById(rootId).lean();
  if (!rootFolder) return [];

  // Helper to recursively fetch child folders in order
  const getDescendants = async (fid: mongoose.Types.ObjectId): Promise<any[]> => {
    const children = await Folder.find({ parentFolderId: fid }).lean();
    const sorted = children.sort((a, b) => (a.order || 0) - (b.order || 0));
    const list: any[] = [];
    for (const child of sorted) {
      list.push(child);
      const sub = await getDescendants(child._id as mongoose.Types.ObjectId);
      list.push(...sub);
    }
    return list;
  };

  const allFolders = [rootFolder, ...(await getDescendants(rootId))];
  const folderIds = allFolders.map((f) => f._id);

  // Fetch all revision cards matching these folders
  const cards = await RevisionCard.find({ folderId: { $in: folderIds } })
    .select('_id folderId order')
    .lean();

  // Group cards by folder ID to maintain hierarchy order
  const cardsByFolder: Record<string, typeof cards> = {};
  for (const card of cards) {
    const fidStr = card.folderId.toString();
    if (!cardsByFolder[fidStr]) {
      cardsByFolder[fidStr] = [];
    }
    cardsByFolder[fidStr].push(card);
  }

  const sortedCardIds: mongoose.Types.ObjectId[] = [];
  for (const f of allFolders) {
    const fidStr = f._id.toString();
    const folderCards = cardsByFolder[fidStr] || [];
    // Sort folder cards by order
    const sortedFolderCards = folderCards.sort((a, b) => (a.order || 0) - (b.order || 0));
    for (const card of sortedFolderCards) {
      sortedCardIds.push(card._id as mongoose.Types.ObjectId);
    }
  }

  return sortedCardIds;
};

export const createSession = async (
  userId: string,
  sourceType: 'folder' | 'playlist' | 'liked' | 'watchLater',
  sourceId: string,
  opts: { shuffle?: boolean } = {}
): Promise<ISessionQueue> => {
  let cardIds: mongoose.Types.ObjectId[] = [];

  const uid = new Types.ObjectId(userId);
  const isSmartPlaylist = ['easy', 'medium', 'hard', 'skipped'].includes(sourceId);
  const targetSourceId = isSmartPlaylist ? SMART_PLAYLIST_MAP[sourceId] : sourceId;
  const sid = new Types.ObjectId(targetSourceId);

  // 1. Fetch card IDs based on source type
  if (sourceType === 'playlist' && isSmartPlaylist) {
    const filterQuery: any = { userId: uid };
    if (sourceId === 'skipped') {
      filterQuery.attemptStatus = 'skipped';
    } else {
      filterQuery.attemptStatus = 'attempted';
      filterQuery.perceivedDifficultyByUser = sourceId;
    }

    const progressRecords = await UserQuestionProgress.find(filterQuery)
      .select('questionId')
      .sort({ updatedAt: -1 })
      .lean();

    cardIds = progressRecords
      .map((p) => p.questionId as mongoose.Types.ObjectId)
      .filter(Boolean);
  } else if (sourceType === 'folder') {
    cardIds = await getFolderCardIdsRecursively(sid);
  } else if (sourceType === 'playlist') {
    const playlist = await Playlist.findOne({ _id: sid, userId: uid }).lean();
    if (!playlist) throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found or unauthorized');
    cardIds = playlist.cardIds || [];
  } else if (sourceType === 'liked') {
    const states = await UserCardState.find({ userId: uid, liked: true })
      .sort({ updatedAt: -1 })
      .select('cardId')
      .lean();
    cardIds = states.map((s) => s.cardId);
  } else if (sourceType === 'watchLater') {
    const states = await UserCardState.find({ userId: uid, watchLater: true })
      .sort({ updatedAt: -1 })
      .select('cardId')
      .lean();
    cardIds = states.map((s) => s.cardId);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid source type');
  }

  if (cardIds.length === 0) {
    console.log('[Session Queue Debug]', {
      sourceId,
      sourceType,
      userId,
      isSmartPlaylist,
      cardCount: cardIds.length,
    });
    
    throw new ApiError(httpStatus.BAD_REQUEST, 'The selected source has no cards to play');
  }

  // 2. Perform shuffle if requested (only affects SessionQueue copy)
  let orderedCardIds = [...cardIds];
  if (opts.shuffle) {
    orderedCardIds = shuffleArray(orderedCardIds);
  }

  // 3. Create SessionQueue document
  const session = await SessionQueue.create({
    userId: uid,
    sourceType,
    sourceId: sid,
    orderedCardIds,
    currentIndex: 0,
    shuffle: !!opts.shuffle,
  });

  return session;
};

export const getSessionQueue = async (userId: string, sessionId: string): Promise<ISessionQueue> => {
  if (!Types.ObjectId.isValid(sessionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid session ID');
  }

  const session = await SessionQueue.findOne({
    _id: new Types.ObjectId(sessionId),
    userId: new Types.ObjectId(userId),
  });

  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session playback queue not found');
  }

  return session;
};

export const updateSessionIndex = async (
  userId: string,
  sessionId: string,
  index: number
): Promise<ISessionQueue> => {
  const session = await getSessionQueue(userId, sessionId);

  if (index < 0 || index >= session.orderedCardIds.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Playback index out of bounds');
  }

  session.currentIndex = index;
  await session.save();
  return session;
};

export const toggleSessionShuffle = async (
  userId: string,
  sessionId: string,
  shuffle: boolean
): Promise<ISessionQueue> => {
  const session = await getSessionQueue(userId, sessionId);
  if (session.shuffle === shuffle) {
    return session;
  }

  const currentCardId = session.orderedCardIds[session.currentIndex];

  if (shuffle) {
    // Shuffling: Keep the current card at the current index, shuffle the rest
    const cardsToShuffle = session.orderedCardIds.filter((_, idx) => idx !== session.currentIndex);
    const shuffled = shuffleArray(cardsToShuffle);
    
    // Construct new ordered card list with current card at index 0 and rest shuffled
    session.orderedCardIds = [currentCardId, ...shuffled];
    session.currentIndex = 0;
  } else {
    // Unshuffling: Restore original folder/playlist/likes order but keep current card's index aligned
    let originalIds: mongoose.Types.ObjectId[] = [];
    
    if (session.sourceType === 'folder') {
      originalIds = await getFolderCardIdsRecursively(session.sourceId);
    } else if (session.sourceType === 'playlist') {
      const isSmart = REVERSE_SMART_PLAYLIST_MAP[session.sourceId.toString()];
      if (isSmart) {
        const filterQuery: any = { userId: session.userId };
        if (isSmart === 'skipped') {
          filterQuery.attemptStatus = 'skipped';
        } else {
          filterQuery.attemptStatus = 'attempted';
          filterQuery.perceivedDifficultyByUser = isSmart;
        }

        const progressRecords = await UserQuestionProgress.find(filterQuery)
          .select('questionId')
          .sort({ updatedAt: -1 })
          .lean();

        originalIds = progressRecords
          .map((p) => p.questionId as mongoose.Types.ObjectId)
          .filter(Boolean);
      } else {
        const playlist = await Playlist.findById(session.sourceId).lean();
        originalIds = playlist?.cardIds || [];
      }
    } else if (session.sourceType === 'liked') {
      const states = await UserCardState.find({ userId: session.userId, liked: true })
        .sort({ updatedAt: -1 })
        .select('cardId')
        .lean();
      originalIds = states.map((s) => s.cardId);
    } else if (session.sourceType === 'watchLater') {
      const states = await UserCardState.find({ userId: session.userId, watchLater: true })
        .sort({ updatedAt: -1 })
        .select('cardId')
        .lean();
      originalIds = states.map((s) => s.cardId);
    }

    if (originalIds.length > 0) {
      session.orderedCardIds = originalIds;
      // Align current index to where the current card is located in original order
      const originalIdx = originalIds.map(id => id.toString()).indexOf(currentCardId.toString());
      session.currentIndex = originalIdx !== -1 ? originalIdx : 0;
    }
  }

  session.shuffle = shuffle;
  await session.save();
  return session;
};

export const getSessionCardsSlice = async (
  userId: string,
  sessionId: string,
  windowSize = 5
) => {
  const session = await getSessionQueue(userId, sessionId);
  const totalCards = session.orderedCardIds.length;
  const currentIdx = session.currentIndex;

  // Compute nearby indices to return (preloading 2 next, 1 previous, etc.)
  const startIdx = Math.max(0, currentIdx - 2);
  const endIdx = Math.min(totalCards - 1, currentIdx + 2);

  const cardSliceIds = session.orderedCardIds.slice(startIdx, endIdx + 1);

  // Fetch only cards in this slice window
  const cards = await RevisionCard.find({ _id: { $in: cardSliceIds } }).lean();

  // Sort according to slice window order
  const cardMap = new Map(cards.map((c) => [c._id.toString(), c]));
  const orderedSlice = cardSliceIds
    .map((id) => cardMap.get(id.toString()))
    .filter(Boolean);

  return {
    orderedCardIds: session.orderedCardIds,
    currentIndex: session.currentIndex,
    shuffle: session.shuffle,
    cardsSlice: orderedSlice,
    sourceType: session.sourceType,
    sourceId: session.sourceId,
  };
};
