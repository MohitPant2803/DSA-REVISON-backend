import mongoose, { Types } from 'mongoose';
import UserCardState, { IUserCardState } from '../models/userCardState.model';
import RevisionCard from '../models/revisionCard.model';

export const getUserCardState = async (userId: string, cardId: string): Promise<IUserCardState> => {
  let state = await UserCardState.findOne({
    userId: new Types.ObjectId(userId),
    cardId: new Types.ObjectId(cardId),
  });

  if (!state) {
    state = await UserCardState.create({
      userId: new Types.ObjectId(userId),
      cardId: new Types.ObjectId(cardId),
    });
  }

  return state;
};

export const toggleLike = async (userId: string, cardId: string): Promise<IUserCardState> => {
  const state = await getUserCardState(userId, cardId);
  state.liked = !state.liked;
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
  const state = await getUserCardState(userId, cardId);
  state.viewed = true;
  state.lastViewedAt = new Date();
  await state.save();
  return state;
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
