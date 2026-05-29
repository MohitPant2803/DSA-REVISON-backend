import mongoose from 'mongoose';
import Playlist, { IPlaylist } from '../models/playlist.model';
import RevisionCard from '../models/revisionCard.model';
import Progress from '../models/progress.model';
import UserQuestionProgress from '../models/userQuestionProgress.model';
import UserCardState from '../models/userCardState.model';

const SYSTEM_PLAYLISTS = [
  { systemKey: 'easy', name: 'Easy', description: 'Dynamic list of cards you marked as Easy', color1: '#10B981', color2: '#059669' },
  { systemKey: 'medium', name: 'Medium', description: 'Dynamic list of cards you marked as Medium', color1: '#F59E0B', color2: '#D97706' },
  { systemKey: 'hard', name: 'Hard', description: 'Dynamic list of cards you marked as Hard', color1: '#EF4444', color2: '#DC2626' },
  { systemKey: 'skipped', name: 'Skipped', description: 'Dynamic list of cards you skipped', color1: '#64748B', color2: '#475569' },
] as const;

type SystemPlaylistKey = typeof SYSTEM_PLAYLISTS[number]['systemKey'];

const isSystemPlaylistKey = (playlistId: string): playlistId is SystemPlaylistKey =>
  SYSTEM_PLAYLISTS.some((p) => p.systemKey === playlistId);

const toClientPlaylist = (playlist: any) => {
  if (playlist.kind === 'system' && playlist.systemKey) {
    return {
      ...playlist,
      mongoId: playlist._id?.toString(),
      _id: playlist.systemKey,
      id: playlist.systemKey,
      orderedCardIds: playlist.cardIds || [],
    };
  }

  return {
    ...playlist,
    _id: playlist._id?.toString?.() || playlist._id,
    id: playlist._id?.toString?.() || playlist._id,
    orderedCardIds: playlist.cardIds || playlist.orderedCardIds || [],
  };
};

const getSystemPlaylistCardIds = async (userId: string, systemKey: SystemPlaylistKey) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const filterQuery: any = { userId: userObjectId };

  if (systemKey === 'skipped') {
    filterQuery.attemptStatus = 'skipped';
  } else {
    filterQuery.attemptStatus = 'attempted';
    filterQuery.perceivedDifficultyByUser = systemKey;
  }

  const progressRecords = await UserQuestionProgress.find(filterQuery)
    .populate({ path: 'questionId', select: 'title' })
    .sort({ updatedAt: -1 })
    .lean();

  const seenTitles = new Set<string>();
  const cardIds: mongoose.Types.ObjectId[] = [];

  progressRecords.forEach((p: any) => {
    const card = p.questionId;
    if (!card?._id || !card.title) return;
    const titleKey = card.title.trim().toLowerCase();
    if (seenTitles.has(titleKey)) return;
    seenTitles.add(titleKey);
    cardIds.push(card._id);
  });

  return cardIds;
};

export const ensureUserSystemPlaylists = async (userId: string) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const docs = await Promise.all(
    SYSTEM_PLAYLISTS.map(async (def) => {
      const cardIds = await getSystemPlaylistCardIds(userId, def.systemKey);
      return Playlist.findOneAndUpdate(
        { userId: userObjectId, kind: 'system', systemKey: def.systemKey },
        {
          $set: {
            userId: userObjectId,
            kind: 'system',
            systemKey: def.systemKey,
            name: def.name,
            title: def.name,
            description: def.description,
            color1: def.color1,
            color2: def.color2,
            cardIds,
            itemCount: cardIds.length,
          },
          $setOnInsert: {
            completedLoops: 0,
            totalCardsViewed: 0,
          },
        },
        { upsert: true, new: true }
      ).lean();
    })
  );

  return docs;
};

export const getUserPlaylistCatalogSummary = async (userId: string) => {
  await ensureUserSystemPlaylists(userId);
  const playlists = await Playlist.find({ userId }).sort({ kind: -1, updatedAt: -1 }).lean();

  const focusAreaPlaylists = playlists.filter((playlist: any) => playlist.kind === 'system');
  const selfMadePlaylists = playlists.filter((playlist: any) => playlist.kind !== 'system');
  const rows = playlists.map((playlist: any) => ({
    type: playlist.kind === 'system' ? 'focus-area' : 'self-made',
    key: playlist.systemKey || playlist._id.toString(),
    name: playlist.name,
    cards: Array.isArray(playlist.cardIds) ? playlist.cardIds.length : (playlist.itemCount || 0),
  }));

  return {
    focusAreaCount: focusAreaPlaylists.length,
    selfMadeCount: selfMadePlaylists.length,
    totalPlaylistCount: playlists.length,
    totalCardRefs: rows.reduce((sum, row) => sum + row.cards, 0),
    rows,
  };
};

export const logUserPlaylistCatalogSummary = async (userId: string, email?: string) => {
  const summary = await getUserPlaylistCatalogSummary(userId);

  console.log(`[Personal Catalog] User: ${email || userId}`);
  console.log(
    `[Personal Catalog] Total playlists: ${summary.totalPlaylistCount} | Focus areas: ${summary.focusAreaCount} | Self-made: ${summary.selfMadeCount} | Card refs: ${summary.totalCardRefs}`
  );
  console.table(summary.rows);

  return summary;
};

export const createPlaylistService = async (userId: string, data: any): Promise<IPlaylist> => {
  const uniqueCardIds = Array.isArray(data.cardIds)
    ? Array.from(new Set<string>(data.cardIds.map((id: any) => id.toString())))
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id))
    : [];

  return Playlist.create({
    ...data,
    userId,
    kind: 'custom',
    cardIds: uniqueCardIds,
    itemCount: uniqueCardIds.length,
  });
};

export const getUserPlaylistsService = async (userId: string): Promise<any[]> => {
  const [systemPlaylists, customPlaylists] = await Promise.all([
    ensureUserSystemPlaylists(userId),
    Playlist.find({ userId, kind: { $ne: 'system' } }).sort('-updatedAt').lean(),
  ]);

  return [...systemPlaylists.map(toClientPlaylist), ...customPlaylists.map(toClientPlaylist)];
};

export const getPlaylistByIdService = async (playlistId: string, userId: string) => {
  if (isSystemPlaylistKey(playlistId)) {
    await ensureUserSystemPlaylists(userId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const filterQuery: any = { userId: userObjectId };
    if (playlistId === 'skipped') {
      filterQuery.attemptStatus = 'skipped';
    } else {
      filterQuery.attemptStatus = 'attempted';
      filterQuery.perceivedDifficultyByUser = playlistId;
    }

    const progressRecords = await UserQuestionProgress.find(filterQuery)
      .populate({
        path: 'questionId',
        select: 'title topic difficulty complexity tags explanation code image examples folderId',
        populate: { path: 'folderId', select: 'title icon color' },
      })
      .sort({ updatedAt: -1 })
      .lean();

    const cards = progressRecords
      .map((p: any) => p.questionId)
      .filter((c: any) => c && c._id);

    const seenTitles = new Set();
    const uniqueCards = [];
    for (const card of cards) {
      if (!card.title) continue;
      const titleKey = card.title.trim().toLowerCase();
      if (!seenTitles.has(titleKey)) {
        seenTitles.add(titleKey);
        uniqueCards.push(card);
      }
    }

    const cardIdsForPop = uniqueCards.map((c: any) => c._id);
    const [progressList, userStates, questionProgressList] = await Promise.all([
      Progress.find({
        userId: userObjectId,
        revisionCardId: { $in: cardIdsForPop },
      }).lean(),
      UserCardState.find({
        userId: userObjectId,
        cardId: { $in: cardIdsForPop },
      }).lean(),
      UserQuestionProgress.find({
        userId: userObjectId,
        questionId: { $in: cardIdsForPop },
      }).lean(),
    ]);

    const progressMap = new Map(progressList.map((p: any) => [p.revisionCardId?.toString(), p]));
    const statesMap = new Map(userStates.map((s: any) => [s.cardId?.toString(), s]));
    const qProgressMap = new Map(questionProgressList.map((qp: any) => [qp.questionId?.toString(), qp]));

    uniqueCards.forEach((card: any) => {
      const prog = progressMap.get(card._id.toString());
      const state = statesMap.get(card._id.toString());
      const qp = qProgressMap.get(card._id.toString());

      card.isFavorite = prog ? !!prog.favorite : false;
      card.isDifficult = prog ? !!prog.difficult : false;
      card.isArchived = prog ? !!prog.archived : false;
      card.difficultyState = prog ? (prog.difficultyState || null) : null;
      card.revisionCount = state ? (state.revisionCount || 0) : 0;
      card.currentUserQuestionProgress = qp
        ? {
            attemptStatus: qp.attemptStatus,
            perceivedDifficultyByUser: qp.perceivedDifficultyByUser,
          }
        : null;
    });

    const cardIds = uniqueCards.map((c: any) => c._id.toString());

    const systemPlaylist = await Playlist.findOne({
      userId: userObjectId,
      kind: 'system',
      systemKey: playlistId,
    }).lean();
    const name = systemPlaylist?.name || playlistId.charAt(0).toUpperCase() + playlistId.slice(1);

    const playlist = {
      _id: playlistId,
      id: playlistId,
      mongoId: systemPlaylist?._id?.toString(),
      kind: 'system',
      systemKey: playlistId,
      name,
      title: name,
      description: `Dynamic list of cards you marked as ${name}`,
      itemCount: uniqueCards.length,
      completedLoops: 0,
      totalCardsViewed: 0,
      color1: playlistId === 'easy' ? '#10B981' : playlistId === 'medium' ? '#F59E0B' : playlistId === 'hard' ? '#EF4444' : '#64748B',
      color2: playlistId === 'easy' ? '#059669' : playlistId === 'medium' ? '#D97706' : playlistId === 'hard' ? '#DC2626' : '#475569',
      cardIds,
    };

    return {
      playlist,
      cardIds,
      items: uniqueCards,
    };
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return null;
  }

  const playlist = await Playlist.findOne({ _id: playlistId, userId }).lean();
  if (!playlist) return null;

  const cardIds = playlist.cardIds || [];

  return {
    playlist,
    cardIds,
    items: cardIds,
  };
};

export const getClientPlaylistsForSyncService = async (userId: string): Promise<any[]> => {
  const [systemPlaylists, customPlaylists] = await Promise.all([
    ensureUserSystemPlaylists(userId),
    Playlist.find({ userId, kind: { $ne: 'system' } }).lean(),
  ]);

  return [...systemPlaylists.map(toClientPlaylist), ...customPlaylists.map(toClientPlaylist)];
};

export const deletePlaylistService = async (playlistId: string, userId: string): Promise<boolean> => {
  const result = await Playlist.findOneAndDelete({ _id: playlistId, userId });
  return !!result;
};

export const addItemToPlaylistService = async (
  playlistId: string,
  userId: string,
  opts: { placardId?: string; revisionCardId?: string }
): Promise<boolean> => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const cardIdStr = opts.revisionCardId || opts.placardId;
  if (!cardIdStr) throw new Error('Either placardId or revisionCardId is required');

  if (!playlist.cardIds) {
    playlist.cardIds = [];
  }

  if (!mongoose.Types.ObjectId.isValid(cardIdStr)) return false;

  const existingIds = new Set(playlist.cardIds.map((id) => id.toString()));
  if (existingIds.has(cardIdStr)) {
    playlist.itemCount = existingIds.size;
    await playlist.save();
    return true;
  }

  playlist.cardIds = [
    ...Array.from(existingIds).map((id) => new mongoose.Types.ObjectId(id)),
    new mongoose.Types.ObjectId(cardIdStr),
  ];
  playlist.itemCount = playlist.cardIds.length;
  await playlist.save();
  return true;
};

export const removeItemFromPlaylistService = async (
  playlistId: string,
  userId: string,
  opts: { placardId?: string; revisionCardId?: string }
): Promise<boolean> => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const cardIdStr = opts.revisionCardId || opts.placardId;
  if (!cardIdStr) return false;

  if (!playlist.cardIds) {
    return false;
  }

  const beforeIds = playlist.cardIds.map((id) => id.toString());
  const lengthBefore = beforeIds.length;
  const nextIds = beforeIds.filter((id) => id !== cardIdStr);
  const uniqueNextIds = Array.from(new Set(nextIds));
  playlist.cardIds = uniqueNextIds.map((id) => new mongoose.Types.ObjectId(id));

  if (playlist.cardIds.length !== lengthBefore) {
    playlist.itemCount = playlist.cardIds.length;
    await playlist.save();
    return true;
  }

  return false;
};

/** @deprecated use addItemToPlaylistService */
export const addPlacardToPlaylistService = async (
  playlistId: string,
  placardId: string,
  userId: string
) => addItemToPlaylistService(playlistId, userId, { revisionCardId: placardId });

/** @deprecated use removeItemFromPlaylistService */
export const removePlacardFromPlaylistService = async (
  playlistId: string,
  placardId: string,
  userId: string
) => removeItemFromPlaylistService(playlistId, userId, { revisionCardId: placardId });

export const reorderPlaylistService = async (playlistId: string, userId: string, cardIds: string[]) => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const uniqueIds = Array.from(new Set(cardIds.map((id) => id.toString())))
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
  playlist.cardIds = uniqueIds.map((id) => new mongoose.Types.ObjectId(id));
  playlist.itemCount = playlist.cardIds.length;
  playlist.customOrderUpdatedAt = new Date();
  await playlist.save();
  return playlist;
};

export const updatePlaylistService = async (
  playlistId: string,
  userId: string,
  data: { name?: string; description?: string; color1?: string; color2?: string }
): Promise<IPlaylist | null> => {
  return Playlist.findOneAndUpdate({ _id: playlistId, userId }, data, { new: true });
};

export const duplicatePlaylistService = async (
  playlistId: string,
  userId: string
): Promise<IPlaylist | null> => {
  const original = await Playlist.findOne({ _id: playlistId, userId });
  if (!original) return null;

  return Playlist.create({
    name: `${original.name} Copy`,
    userId,
    cardIds: original.cardIds || [],
    itemCount: original.itemCount || 0,
    color1: original.color1,
    color2: original.color2,
  });
};
