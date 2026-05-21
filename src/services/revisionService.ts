import httpStatus from 'http-status';
import { Types } from 'mongoose';
import RevisionCard, { IRevisionCard } from '../models/revisionCard.model';
import Folder from '../models/folder.model';
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
  query: QueryRevisionCardsInput,
  actorRole?: UserRole
) => {
  const { page = '1', limit = '10', sort, search, topic, difficulty, folderId, tags } = query;

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
    filter.folderId = new Types.ObjectId(folderId);
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
  const results = await RevisionCard.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .populate(populateCreator)
    .populate('folderId', 'title icon color')
    .lean();

  const totalPages = Math.ceil(totalResults / limitNum);

  return {
    results,
    page: pageNum,
    limit: limitNum,
    totalPages,
    totalResults,
  };
};

export const getRevisionCardById = async (cardId: string, actorRole?: UserRole) => {
  if (!Types.ObjectId.isValid(cardId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid card ID');
  }

  const card = await RevisionCard.findById(cardId)
    .populate(populateCreator)
    .populate('folderId', 'title icon color')
    .lean();

  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Revision card not found');
  }

  if (!canReadResource(card.visibility, actorRole)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this card');
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
    card.folderId = new Types.ObjectId(updateData.folderId);
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

  await card.deleteOne();
};

export const getCardsByFolder = async (
  folderId: string,
  query: QueryRevisionCardsInput,
  actorRole?: UserRole
) => {
  return queryRevisionCards({ ...query, folderId }, actorRole);
};
