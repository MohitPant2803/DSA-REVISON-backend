import httpStatus from 'http-status';
import { Types } from 'mongoose';
import Folder, { IFolder } from '../models/folder.model';
import { isValidId } from '../utils/validation';
import RevisionCard from '../models/revisionCard.model';
import FolderProgress from '../models/folderProgress.model';
import UserCardState from '../models/userCardState.model';
import {
  CreateFolderInput,
  QueryFoldersInput,
  UpdateFolderInput,
} from '../validators/folder.validator';
import ApiError from '../utils/ApiError';
import { canManageResource, canReadResource, UserRole } from '../utils/permissions';

const populateCreator = { path: 'createdBy', select: 'name email profilePicture role' };

async function attachCardCounts<T extends { _id: any }>(folders: T[], userId?: string) {
  if (folders.length === 0) return [];
  const folderIds = folders.map(f => f._id);

  // 1. Fetch ALL folders to build parent-child descendant tree in-memory
  const allFolders = await Folder.find({}).select('_id parentFolderId').lean();
  
  const childrenMap = new Map<string, string[]>();
  allFolders.forEach(f => {
    if (f.parentFolderId) {
      const pId = f.parentFolderId.toString();
      const existing = childrenMap.get(pId) || [];
      existing.push(f._id.toString());
      childrenMap.set(pId, existing);
    }
  });

  function getDescendantIds(folderId: string): string[] {
    const ids: string[] = [folderId];
    const queue = [folderId];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      const children = childrenMap.get(curr) || [];
      for (const child of children) {
        if (!ids.includes(child)) {
          ids.push(child);
          queue.push(child);
        }
      }
    }
    return ids;
  }

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
    { $group: { _id: "$folderAssociations", count: { $sum: 1 } } }
  ]);

  const directCountMap = new Map<string, number>();
  for (const item of cardCountsAggregation) {
    if (item._id != null) {
      try {
        directCountMap.set(item._id.toString(), item.count);
      } catch {
        // skip items with non-stringifiable _id
      }
    }
  }

  // Fetch materialized progress if userId is provided
  const progressMap = new Map<string, any>();
  if (userId) {
    const progressList = await FolderProgress.find({ userId: new Types.ObjectId(userId) }).lean();
    progressList.forEach((p: any) => {
      progressMap.set(p.folderId.toString(), p);
    });
  }

  // Assemble final results in-memory
  return folders.map(folder => {
    const folderIdStr = folder._id.toString();
    const descendants = getDescendantIds(folderIdStr);
    
    let recursiveCount = 0;
    descendants.forEach(dId => {
      recursiveCount += directCountMap.get(dId) || 0;
    });

    const progress = progressMap.get(folderIdStr);

    return {
      ...folder,
      cardCount: progress && progress.totalCount !== undefined ? progress.totalCount : recursiveCount,
      seenCardCount: progress && progress.seenCount !== undefined ? progress.seenCount : 0,
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

export const queryFolders = async (query: QueryFoldersInput, actorRole?: UserRole, userId?: string) => {
  const { page = '1', limit = '50', search, parentFolderId } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, unknown> = {
    ...buildVisibilityFilter(actorRole),
  };

  if (parentFolderId) {
    filter.parentFolderId = parentFolderId === 'null' ? null : parentFolderId;
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

  const withCounts = await attachCardCounts(results, userId);

  return {
    results: withCounts,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(totalResults / limitNum),
    totalResults,
  };
};

export const getFolderById = async (folderId: string, actorRole?: UserRole, userId?: string) => {
  if (!isValidId(folderId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid folder ID');
  }

  const folder = await Folder.findById(folderId).populate(populateCreator).lean();
  if (!folder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
  }

  if (!canReadResource(folder.visibility, actorRole)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this folder');
  }

  // Fetch all folders to build parent-child descendant tree recursively
  const allFolders = await Folder.find({}).select('_id parentFolderId').lean();
  const childrenMap = new Map<string, string[]>();
  allFolders.forEach(f => {
    if (f.parentFolderId) {
      const pId = f.parentFolderId.toString();
      const existing = childrenMap.get(pId) || [];
      existing.push(f._id.toString());
      childrenMap.set(pId, existing);
    }
  });

  function getDescendantIds(fid: string): string[] {
    const ids: string[] = [fid];
    const queue = [fid];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      const children = childrenMap.get(curr) || [];
      for (const child of children) {
        if (!ids.includes(child)) {
          ids.push(child);
          queue.push(child);
        }
      }
    }
    return ids;
  }

  const descendants = getDescendantIds(folder._id.toString());

  const cardCount = await RevisionCard.countDocuments({
    isDeleted: false,
    folderId: { $in: descendants }
  });
  const childFolders = await Folder.find({ parentFolderId: folder._id }).select('_id');

  let seenCardCount = 0;
  let finalCardCount = cardCount;

  if (userId) {
    const progress = await FolderProgress.findOne({
      userId: new Types.ObjectId(userId),
      folderId: folder._id
    }).lean();
    if (progress) {
      seenCardCount = progress.seenCount || 0;
      finalCardCount = progress.totalCount !== undefined ? progress.totalCount : cardCount;
    }
  }

  return { 
    ...folder, 
    cardCount: finalCardCount, 
    seenCardCount, 
    hasSubfolders: childFolders.length > 0 
  };
};

export const createFolder = async (data: CreateFolderInput, userId: Types.ObjectId): Promise<IFolder> => {
  const payload: Record<string, unknown> = {
    ...data,
    createdBy: userId,
  };

  if (data.parentFolderId) {
    if (!isValidId(data.parentFolderId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid parent folder ID');
    }
    payload.parentFolderId = data.parentFolderId;
  }

  return Folder.create(payload);
};

export const updateFolderById = async (
  folderId: string,
  updateData: UpdateFolderInput,
  userId: Types.ObjectId,
  userRole: UserRole
): Promise<IFolder> => {
  if (!isValidId(folderId)) {
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
    } else if (isValidId(updateData.parentFolderId)) {
      folder.parentFolderId = updateData.parentFolderId;
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
  if (!isValidId(folderId)) {
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
  if (!isValidId(folderId)) {
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

  folder.cardIds = cardIds;
  await folder.save();
  return folder;
};

export const reconcileFolderCounts = async (userId: string) => {
  const uid = new Types.ObjectId(userId);
  
  // 1. Fetch direct card counts grouped by folder
  const countsAgg = await RevisionCard.aggregate([
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
    { $group: { _id: "$folderAssociations", count: { $sum: 1 } } }
  ]);
  
  // 2. Fetch viewed card counts grouped by folder
  const viewedStates = await UserCardState.find({ userId: uid, viewed: true }).select('cardId').lean();
  const viewedCardIds = viewedStates.map((s: any) => s.cardId);
  
  const viewedAgg = await RevisionCard.aggregate([
    { $match: { _id: { $in: viewedCardIds }, isDeleted: false } },
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
    { $group: { _id: "$folderAssociations", count: { $sum: 1 } } }
  ]);

  const directCountMap = new Map(countsAgg.map(i => [i._id.toString(), i.count]));
  const directViewedMap = new Map(viewedAgg.map(i => [i._id.toString(), i.count]));

  // 3. Perform a transactional overwrite on FolderProgress to reconcile counts
  const folders = await Folder.find({}).select('_id').lean();
  const bulkOps = folders.map(f => {
    const folderIdStr = f._id.toString();
    return {
      updateOne: {
        filter: { userId: uid, folderId: f._id },
        update: {
          $set: {
            totalCount: directCountMap.get(folderIdStr) || 0,
            seenCount: directViewedMap.get(folderIdStr) || 0,
            updatedAt: new Date()
          }
        },
        upsert: true
      }
    };
  });
  
  if (bulkOps.length > 0) {
    await FolderProgress.bulkWrite(bulkOps);
  }
};
