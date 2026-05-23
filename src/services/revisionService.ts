import httpStatus from 'http-status';
import { Types } from 'mongoose';
import RevisionCard, { IRevisionCard } from '../models/revisionCard.model';
import Folder from '../models/folder.model';
import Progress from '../models/progress.model';
import UserCardState from '../models/userCardState.model';
import {
  CreateRevisionCardInput,
  QueryRevisionCardsInput,
  UpdateRevisionCardInput,
} from '../validators/revisionCard.validator';
import ApiError from '../utils/ApiError';
import { canManageResource, canReadResource, UserRole } from '../utils/permissions';

const populateCreator = { path: 'createdBy', select: 'name email profilePicture role' };

function buildVisibilityFilter(actorRole?: UserRole) {
  if (actorRole === 'admin' || actorRole === 'superadmin') {
    return {};
  }
  return { visibility: 'public' };
}

export const queryRevisionCards = async (
  query: QueryRevisionCardsInput & { excludeSlides?: string },
  actorRole?: UserRole,
  userId?: string
) => {
  const { page = '1', limit = '10', sort, search, topic, difficulty, folderId, tags, excludeSlides } = query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = {
    ...buildVisibilityFilter(actorRole),
  };

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }
  if (topic) {
    filter.topic = topic;
  }
  if (difficulty) {
    filter.difficulty = difficulty;
  }
  if (folderId) {
    if (!Types.ObjectId.isValid(folderId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder ID');
    }
    // Fetch all child subfolder IDs recursively to support sheet-level and folder-level queries
    const childFolders = await Folder.find({ parentFolderId: new Types.ObjectId(folderId) }).select('_id');
    const folderIds = [new Types.ObjectId(folderId), ...childFolders.map((f) => f._id)];
    filter.folderId = { $in: folderIds };
  }
  if (tags) {
    filter.tags = { $in: tags.split(',').map((t) => t.trim()).filter(Boolean) };
  }

  const sortOptions: Record<string, 1 | -1> = {};
  if (sort) {
    const [key, order] = sort.split(':');
    sortOptions[key] = order === 'desc' ? -1 : 1;
  } else {
    sortOptions.order = 1;
    sortOptions.createdAt = -1;
  }

  const totalResults = await RevisionCard.countDocuments(filter);
  
  const dbQuery = RevisionCard.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .populate(populateCreator)
    .populate('folderId', 'title icon color');

  if (excludeSlides === 'true') {
    dbQuery.select('-slides');
  }

  const results = await dbQuery.lean();

  if (userId) {
    const cardIds = results.map((r) => r._id);
    const [progressList, userStates] = await Promise.all([
      Progress.find({
        userId: new Types.ObjectId(userId),
        revisionCardId: { $in: cardIds },
      }).lean(),
      UserCardState.find({
        userId: new Types.ObjectId(userId),
        cardId: { $in: cardIds },
      }).lean()
    ]);

    const progressMap = new Map(progressList.map((p: any) => [p.revisionCardId?.toString(), p]));
    const statesMap = new Map(userStates.map((s: any) => [s.cardId?.toString(), s]));

    results.forEach((card: any) => {
      const prog = progressMap.get(card._id.toString());
      const state = statesMap.get(card._id.toString());
      card.isFavorite = prog ? !!prog.favorite : false;
      card.isDifficult = prog ? !!prog.difficult : false;
      card.isArchived = prog ? !!prog.archived : false;
      card.revisionCount = state ? (state.revisionCount || 0) : 0;
    });
  } else {
    results.forEach((card: any) => {
      card.isFavorite = false;
      card.isDifficult = false;
      card.isArchived = false;
      card.revisionCount = 0;
    });
  }

  const totalPages = Math.ceil(totalResults / limitNum);

  return {
    results,
    page: pageNum,
    limit: limitNum,
    totalPages,
    totalResults,
  };
};

export const getRevisionCardById = async (cardId: string, actorRole?: UserRole, userId?: string) => {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid card ID');
  }

  const card = await RevisionCard.findById(cardId)
    .populate(populateCreator)
    .populate('folderId', 'title icon color')
    .lean() as any;

  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Revision card not found');
  }

  if (!canReadResource(card.visibility, actorRole)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this card');
  }

  if (userId) {
    const [prog, state] = await Promise.all([
      Progress.findOne({
        userId: new Types.ObjectId(userId),
        revisionCardId: card._id,
      }).lean(),
      UserCardState.findOne({
        userId: new Types.ObjectId(userId),
        cardId: card._id,
      }).lean()
    ]);
    card.isFavorite = prog ? !!prog.favorite : false;
    card.isDifficult = prog ? !!prog.difficult : false;
    card.isArchived = prog ? !!prog.archived : false;
    card.revisionCount = state ? (state.revisionCount || 0) : 0;
  } else {
    card.isFavorite = false;
    card.isDifficult = false;
    card.isArchived = false;
    card.revisionCount = 0;
  }

  return card;
};

export const createRevisionCard = async (
  cardData: CreateRevisionCardInput,
  userId: Types.ObjectId
): Promise<IRevisionCard> => {
  if (!Types.ObjectId.isValid(cardData.folderId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder ID');
  }

  const folder = await Folder.findById(cardData.folderId);
  if (!folder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
  }

  const card = await RevisionCard.create({
    ...cardData,
    folderId: new Types.ObjectId(cardData.folderId),
    createdBy: userId,
  });

  // Append new card's ID to parent folder's cardIds
  if (!folder.cardIds) {
    folder.cardIds = [];
  }
  folder.cardIds.push(card._id);
  await folder.save();

  await card.populate(populateCreator);
  return card;
};

export const updateRevisionCardById = async (
  cardId: string,
  updateData: UpdateRevisionCardInput,
  userId: Types.ObjectId,
  userRole: UserRole
): Promise<IRevisionCard> => {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid card ID');
  }

  const card = await RevisionCard.findById(cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Revision card not found');
  }

  const allowed = await canManageResource(userId, userRole, card.createdBy);
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this card');
  }

  if (updateData.folderId) {
    if (!Types.ObjectId.isValid(updateData.folderId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder ID');
    }
    const folder = await Folder.findById(updateData.folderId);
    if (!folder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
    }
    const oldFolderId = card.folderId;
    card.folderId = new Types.ObjectId(updateData.folderId);

    // If moving folders, pull cardId from old folder and push to new folder
    if (oldFolderId && oldFolderId.toString() !== updateData.folderId.toString()) {
      await Folder.findByIdAndUpdate(oldFolderId, { $pull: { cardIds: card._id } });
      await Folder.findByIdAndUpdate(updateData.folderId, { $addToSet: { cardIds: card._id } });
    }

    delete updateData.folderId;
  }

  Object.assign(card, updateData);
  await card.save();
  return card.populate(populateCreator);
};

export const deleteRevisionCardById = async (
  cardId: string,
  userId: Types.ObjectId,
  userRole: UserRole
): Promise<void> => {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid card ID');
  }

  const card = await RevisionCard.findById(cardId);
  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Revision card not found');
  }

  const allowed = await canManageResource(userId, userRole, card.createdBy);
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this card');
  }

  const folderId = card.folderId;
  await card.deleteOne();

  // Remove card ID from parent folder
  if (folderId) {
    await Folder.findByIdAndUpdate(folderId, { $pull: { cardIds: card._id } });
  }
};

export const getCardsByFolder = async (
  folderId: string,
  query: QueryRevisionCardsInput,
  actorRole?: UserRole,
  userId?: string
) => {
  return queryRevisionCards({ ...query, folderId }, actorRole, userId);
};

export const getRevisionCardsByIds = async (
  cardIds: string[],
  actorRole?: UserRole,
  userId?: string
) => {
  const validIds = cardIds.filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id));
  if (validIds.length === 0) return [];

  const filter = {
    _id: { $in: validIds },
    ...buildVisibilityFilter(actorRole),
  };

  const cards = await RevisionCard.find(filter)
    .populate(populateCreator)
    .populate('folderId', 'title icon color')
    .lean() as any[];

  if (userId && cards.length > 0) {
    const [progressList, userStates] = await Promise.all([
      Progress.find({
        userId: new Types.ObjectId(userId),
        revisionCardId: { $in: validIds },
      }).lean(),
      UserCardState.find({
        userId: new Types.ObjectId(userId),
        cardId: { $in: validIds },
      }).lean()
    ]);

    const progressMap = new Map(progressList.map((p: any) => [p.revisionCardId?.toString(), p]));
    const statesMap = new Map(userStates.map((s: any) => [s.cardId?.toString(), s]));

    cards.forEach((card: any) => {
      const prog = progressMap.get(card._id.toString());
      const state = statesMap.get(card._id.toString());
      card.isFavorite = prog ? !!prog.favorite : false;
      card.isDifficult = prog ? !!prog.difficult : false;
      card.isArchived = prog ? !!prog.archived : false;
      card.revisionCount = state ? (state.revisionCount || 0) : 0;
    });
  } else {
    cards.forEach((card: any) => {
      card.isFavorite = false;
      card.isDifficult = false;
      card.isArchived = false;
      card.revisionCount = 0;
    });
  }

  // Preserve ordering of input cardIds
  const cardsMap = new Map(cards.map((c) => [c._id.toString(), c]));
  return cardIds
    .map((id) => cardsMap.get(id))
    .filter(Boolean);
};
