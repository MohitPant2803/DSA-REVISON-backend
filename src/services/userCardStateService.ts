import mongoose, { Types } from 'mongoose';
import UserCardState, { IUserCardState } from '../models/userCardState.model';
import RevisionCard from '../models/revisionCard.model';

export const getUserCardState = async (userId: string, cardId: string): Promise<IUserCardState> => {
  const uid = new Types.ObjectId(userId);
  const cid = new Types.ObjectId(cardId);

  try {
    // Use findOneAndUpdate with upsert to handle concurrent insertions atomically
    const state = await UserCardState.findOneAndUpdate(
      { userId: uid, cardId: cid },
      { $setOnInsert: { userId: uid, cardId: cid } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (state) return state;
  } catch (err: any) {
    // If a duplicate key error (code 11000) is thrown, the document was just inserted concurrently.
    // We can safely find and return it.
    if (err.code === 11000) {
      const state = await UserCardState.findOne({ userId: uid, cardId: cid });
      if (state) return state as IUserCardState;
    }
    throw err;
  }

  throw new Error('Failed to retrieve or create user card state');
};


export const incrementRevision = async (userId: string, cardId: string): Promise<IUserCardState> => {
  const state = await getUserCardState(userId, cardId);
  state.revisionCount = (state.revisionCount || 0) + 1;
  state.liked = true; // Mark as liked/revised so it appears in the Revised playlist
  await state.save();
  return state;
};

export const toggleWatchLater = async (userId: string, cardId: string): Promise<IUserCardState> => {
  const state = await getUserCardState(userId, cardId);
  state.watchLater = !state.watchLater;
  await state.save();
  return state;
};

export const markViewed = async (userId: string, cardId: string): Promise<IUserCardState> => {
  const uid = new Types.ObjectId(userId);
  const cid = new Types.ObjectId(cardId);

  try {
    // 1. Atomically attempt to transition state from viewed: false/null to viewed: true
    const updatedState = await UserCardState.findOneAndUpdate(
      { userId: uid, cardId: cid, viewed: { $ne: true } },
      { 
        $set: { viewed: true, lastViewedAt: new Date() },
        $inc: { viewCount: 1 }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // 2. If it is a new transition (viewCount transitioned to 1)
    if (updatedState && updatedState.viewCount === 1) {
      const card = await RevisionCard.findById(cid).select('folderId rootFolderId subfolderIds').lean();
      if (card) {
        const associatedFolderIds: Types.ObjectId[] = [];
        if (card.folderId) associatedFolderIds.push(card.folderId);
        if (card.rootFolderId && card.rootFolderId.toString() !== card.folderId.toString()) {
          associatedFolderIds.push(card.rootFolderId);
        }
        if (card.subfolderIds && Array.isArray(card.subfolderIds)) {
          card.subfolderIds.forEach((id: any) => {
            if (id && !associatedFolderIds.some(x => x.toString() === id.toString())) {
              associatedFolderIds.push(id);
            }
          });
        }

        if (associatedFolderIds.length > 0) {
          // Increment FolderProgress for all associated folder levels atomically
          const FolderProgress = mongoose.model('FolderProgress');
          await FolderProgress.updateMany(
            { userId: uid, folderId: { $in: associatedFolderIds } },
            { $inc: { seenCount: 1 } },
            { upsert: true }
          );
        }
      }
    }
  } catch (err: any) {
    // If a duplicate key error (code 11000) is thrown, it was concurrently marked or already exists.
    if (err.code !== 11000) {
      throw err;
    }
  }

  // Fetch the final absolute state to return safely
  return (await getUserCardState(userId, cardId)) as IUserCardState;
};

export const getLikedCards = async (userId: string, query: { page?: string; limit?: string }) => {
  const pageNum = parseInt(query.page || '1', 10);
  const limitNum = parseInt(query.limit || '20', 10);
  const skip = (pageNum - 1) * limitNum;

  const states = await UserCardState.find({
    userId: new Types.ObjectId(userId),
    liked: true,
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const totalResults = await UserCardState.countDocuments({
    userId: new Types.ObjectId(userId),
    liked: true,
  });

  const cardIds = states.map((s) => s.cardId);
  const cards = await RevisionCard.find({ _id: { $in: cardIds } }).lean();

  // Maintain sorting order as states
  const cardMap = new Map(cards.map((c) => [c._id.toString(), c]));
  const orderedCards = states
    .map((s) => {
      const card = cardMap.get(s.cardId.toString());
      if (card) {
        return {
          ...card,
          isFavorite: true,
          liked: true,
          watchLater: s.watchLater,
          viewed: s.viewed,
          revisionCount: s.revisionCount || 0,
        };
      }
      return null;
    })
    .filter(Boolean);

  return {
    results: orderedCards,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalResults / limitNum),
    totalResults,
  };
};

export const getWatchLaterCards = async (userId: string, query: { page?: string; limit?: string }) => {
  const pageNum = parseInt(query.page || '1', 10);
  const limitNum = parseInt(query.limit || '20', 10);
  const skip = (pageNum - 1) * limitNum;

  const states = await UserCardState.find({
    userId: new Types.ObjectId(userId),
    watchLater: true,
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const totalResults = await UserCardState.countDocuments({
    userId: new Types.ObjectId(userId),
    watchLater: true,
  });

  const cardIds = states.map((s) => s.cardId);
  const cards = await RevisionCard.find({ _id: { $in: cardIds } }).lean();

  const cardMap = new Map(cards.map((c) => [c._id.toString(), c]));
  const orderedCards = states
    .map((s) => {
      const card = cardMap.get(s.cardId.toString());
      if (card) {
        return {
          ...card,
          isFavorite: s.liked,
          liked: s.liked,
          watchLater: true,
          viewed: s.viewed,
        };
      }
      return null;
    })
    .filter(Boolean);

  return {
    results: orderedCards,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalResults / limitNum),
    totalResults,
  };
};
