import httpStatus from 'http-status';
import { Types } from 'mongoose';
import Folder, { IFolder } from '../models/folder.model';
import RevisionCard from '../models/revisionCard.model';
import {
  CreateFolderInput,
  QueryFoldersInput,
  UpdateFolderInput,
} from '../validators/folder.validator';
import ApiError from '../utils/ApiError';
import { canManageResource, canReadResource, UserRole } from '../utils/permissions';

const populateCreator = { path: 'createdBy', select: 'name email profilePicture role' };

async function attachCardCounts<T extends { _id: Types.ObjectId }>(folders: T[]) {
  const ids = folders.map((f) => f._id);
  const counts = await RevisionCard.aggregate([
    { $match: { folderId: { $in: ids } } },
    { $group: { _id: '$folderId', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count as number]));
  return folders.map((folder) => ({
    ...folder,
    cardCount: countMap.get(folder._id.toString()) ?? 0,
  }));
}

function buildVisibilityFilter(actorRole?: UserRole) {
  if (actorRole === 'admin' || actorRole === 'superadmin') {
    return {};
  }
  return { visibility: 'public' };
}

export const queryFolders = async (query: QueryFoldersInput, actorRole?: UserRole) => {
  const { page = '1', limit = '50', search, parentFolderId } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = {
    ...buildVisibilityFilter(actorRole),
  };

  if (parentFolderId) {
    filter.parentFolderId = parentFolderId === 'null' ? null : new Types.ObjectId(parentFolderId);
  } else {
    filter.parentFolderId = null;
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const totalResults = await Folder.countDocuments(filter);
  const results = await Folder.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate(populateCreator)
    .lean();

  const withCounts = await attachCardCounts(results);

  return {
    results: withCounts,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalResults / limitNum),
    totalResults,
  };
};

export const getFolderById = async (folderId: string, actorRole?: UserRole) => {
  if (!Types.ObjectId.isValid(folderId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder ID');
  }

  const folder = await Folder.findById(folderId).populate(populateCreator).lean();
  if (!folder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
  }

  if (!canReadResource(folder.visibility, actorRole)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this folder');
  }

  const cardCount = await RevisionCard.countDocuments({ folderId: folder._id });
  return { ...folder, cardCount };
};

export const createFolder = async (data: CreateFolderInput, userId: Types.ObjectId): Promise<IFolder> => {
  const payload: Record<string, unknown> = {
    ...data,
    createdBy: userId,
  };

  if (data.parentFolderId) {
    if (!Types.ObjectId.isValid(data.parentFolderId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid parent folder ID');
    }
    payload.parentFolderId = new Types.ObjectId(data.parentFolderId);
  }

  return Folder.create(payload);
};

export const updateFolderById = async (
  folderId: string,
  updateData: UpdateFolderInput,
  userId: Types.ObjectId,
  userRole: UserRole
): Promise<IFolder> => {
  if (!Types.ObjectId.isValid(folderId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder ID');
  }

  const folder = await Folder.findById(folderId);
  if (!folder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
  }

  const allowed = await canManageResource(userId, userRole, folder.createdBy);
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this folder');
  }

  if (updateData.parentFolderId !== undefined) {
    if (updateData.parentFolderId === null) {
      folder.parentFolderId = null;
    } else if (Types.ObjectId.isValid(updateData.parentFolderId)) {
      folder.parentFolderId = new Types.ObjectId(updateData.parentFolderId);
    }
    delete updateData.parentFolderId;
  }

  Object.assign(folder, updateData);
  await folder.save();
  return folder;
};

export const deleteFolderById = async (
  folderId: string,
  userId: Types.ObjectId,
  userRole: UserRole
): Promise<void> => {
  if (!Types.ObjectId.isValid(folderId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder ID');
  }

  const folder = await Folder.findById(folderId);
  if (!folder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
  }

  const allowed = await canManageResource(userId, userRole, folder.createdBy);
  if (!allowed) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this folder');
  }

  await RevisionCard.deleteMany({ folderId: folder._id });
  await folder.deleteOne();
};
