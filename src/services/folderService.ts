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
  if (folders.length === 0) return [];
  const folderIds = folders.map(f => f._id);

  // Query 1: Batch check which folders have child subfolders in exactly ONE query
  const childFoldersList = await Folder.find({ parentFolderId: { $in: folderIds } })
    .select('parentFolderId')
    .lean();
  const subfoldersParentSet = new Set(childFoldersList.map(c => c.parentFolderId?.toString()));

  // Query 2: Batch count unique revision cards per folder using set union to prevent double-counting
  const cardCountsAggregation = await RevisionCard.aggregate([
    { $match: { isDeleted: false } },
    {
      $project: {
        folderAssociations: {
          $setUnion: [
            [ { $ifNull: [ "$folderId", null ] }, { $ifNull: [ "$rootFolderId", null ] } ],
            { $ifNull: [ "$subfolderIds", [] ] }
          ]
        }
      }
    },
    { $unwind: "$folderAssociations" },
    { $match: { folderAssociations: { $in: folderIds } } },
    { $group: { _id: "$folderAssociations", count: { $sum: 1 } } }
  ]);

  const countMap = new Map<string, number>(
    cardCountsAggregation.map((item: any) => [item._id.toString(), item.count])
  );

  // Assemble final results in-memory
  return folders.map(folder => {
    const folderIdStr = folder._id.toString();
    return {
      ...folder,
      cardCount: countMap.get(folderIdStr) || 0,
      hasSubfolders: subfoldersParentSet.has(folderIdStr),
    };
  });
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

  const cardCount = await RevisionCard.countDocuments({
    $and: [
      { isDeleted: false },
      {
        $or: [
          { folderId: folder._id },
          { subfolderIds: folder._id },
          { rootFolderId: folder._id }
        ]
      }
    ]
  });
  const childFolders = await Folder.find({ parentFolderId: folder._id }).select('_id');
  return { ...folder, cardCount, hasSubfolders: childFolders.length > 0 };
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

export const reorderFolderCards = async (
  folderId: string,
  cardIds: string[],
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
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to reorder cards in this folder');
  }

  folder.cardIds = cardIds.map(id => new Types.ObjectId(id));
  await folder.save();
  return folder;
};
