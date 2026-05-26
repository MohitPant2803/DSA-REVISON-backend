import { Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import RevisionCard from '../models/revisionCard.model';
import Folder from '../models/folder.model';
import Playlist from '../models/playlist.model';
import UserQuestionProgress from '../models/userQuestionProgress.model';
import Progress from '../models/progress.model';
import ProcessedMutation from '../models/processedMutation.model';
import { AuthRequest } from './playlist.controller';
import { updateUserQuestionProgress } from '../services/userQuestionProgress.service';
import { updateProgressService, reorderLikesService } from '../services/progress.service';
import { 
  addItemToPlaylistService, 
  removeItemFromPlaylistService, 
  reorderPlaylistService,
  createPlaylistService,
  deletePlaylistService,
  updatePlaylistService
} from '../services/playlist.service';
import { 
  createFolder, 
  deleteFolderById, 
  updateFolderById 
} from '../services/folderService';

const CURRENT_DB_VERSION = 'striver-sde-sheet-v3';

export const handleDeltaSync = asyncHandler(async (req: AuthRequest, res: Response) => {
  const sinceStr = req.query.since as string;
  const since = sinceStr ? new Date(sinceStr) : new Date(0);
  const userId = req.user!._id;

  // Fetch only changes that happened after 'since'
  const [cards, folders, playlists, questionProgress, progress] = await Promise.all([
    RevisionCard.find({ updatedAt: { $gt: since } }).lean(),
    Folder.find({ updatedAt: { $gt: since } }).lean(),
    Playlist.find({ userId, updatedAt: { $gt: since } }).lean(),
    UserQuestionProgress.find({ userId, updatedAt: { $gt: since } }).lean(),
    Progress.find({ userId, updatedAt: { $gt: since } }).lean(),
  ]);

  return successResponse(res, 200, 'Sync delta fetched successfully', {
    timestamp: new Date(),
    dbVersion: CURRENT_DB_VERSION,
    delta: {
      cards,
      folders,
      playlists,
      questionProgress,
      progress,
    },
  });
});

export const handleSyncActions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { actions } = req.body;
  if (!Array.isArray(actions)) {
    return errorResponse(res, 400, 'actions must be an array of objects');
  }

  const userId = req.user!._id.toString();
  const role = req.user!.role || 'user';

  const processedIds: string[] = [];
  const failedIds: string[] = [];
  const permanentFailures: string[] = [];

  // Process actions sequentially (Last-Write-Wins based on offline timestamps)
  // We wrap them in try-catch to ensure one bad action doesn't crash the entire batch sync!
  for (const item of actions) {
    const { id: mutationId, action, payload } = item;

    if (!mutationId) continue;

    // Idempotency check: Skip already-processed enqueued action IDs (UUID v4)
    const alreadyProcessed = await ProcessedMutation.findOne({ mutationId });
    if (alreadyProcessed) {
      console.log(`[Batch Sync Idempotency] Skipping already processed action ID: ${mutationId}`);
      processedIds.push(mutationId);
      continue;
    }

    try {
      console.log(`[Batch Sync Action] Processing offline action: ${action} | User: ${userId}`);

      switch (action) {
        case 'CLASSIFY_CARD': {
          const { cardId, state } = payload;
          if (cardId) {
            await updateUserQuestionProgress(userId, cardId, state);
          }
          break;
        }

        case 'TOGGLE_FAVORITE': {
          const { cardId, value } = payload;
          if (cardId) {
            await updateProgressService(userId, {
              revisionCardId: cardId,
              favorite: value,
            });
          }
          break;
        }

        case 'TOGGLE_PLAYLIST_ITEM': {
          const { playlistId, cardId, value } = payload;
          if (playlistId && cardId) {
            // Reconcile client temporary playlist IDs silently
            if (playlistId.startsWith('temp-')) {
              console.log(`[Batch Sync] Skipping playlist toggle for temp playlist: ${playlistId}. Re-syncing later.`);
              break;
            }
            if (value) {
              await addItemToPlaylistService(playlistId, userId, { revisionCardId: cardId }).catch(() => {});
            } else {
              await removeItemFromPlaylistService(playlistId, userId, { revisionCardId: cardId }).catch(() => {});
            }
          }
          break;
        }

        case 'REORDER_PLAYLIST': {
          const { playlistId, cardIds } = payload;
          if (playlistId && Array.isArray(cardIds)) {
            if (playlistId.startsWith('temp-')) break;
            await reorderPlaylistService(playlistId, userId, cardIds);
          }
          break;
        }

        case 'REORDER_LIKES': {
          const { cardIds } = payload;
          if (Array.isArray(cardIds)) {
            await reorderLikesService(userId, cardIds);
          }
          break;
        }

        case 'CREATE_PLAYLIST': {
          const { name, color1, color2 } = payload;
          if (name) {
            // Idempotency: verify this playlist does not already exist
            const existing = await Playlist.findOne({ userId, name });
            if (!existing) {
              await createPlaylistService(userId, { name, color1, color2 });
            }
          }
          break;
        }

        case 'DELETE_PLAYLIST': {
          const { playlistId } = payload;
          if (playlistId && !playlistId.startsWith('temp-')) {
            await deletePlaylistService(playlistId, userId).catch(() => {});
          }
          break;
        }

        case 'UPDATE_PLAYLIST': {
          const { playlistId, name } = payload;
          if (playlistId && name && !playlistId.startsWith('temp-')) {
            await updatePlaylistService(playlistId, userId, { name }).catch(() => {});
          }
          break;
        }

        case 'CREATE_FOLDER': {
          const { dto } = payload;
          if (dto && dto.title) {
            const existing = await Folder.findOne({ createdBy: userId, title: dto.title });
            if (!existing) {
              await createFolder(dto, new mongoose.Types.ObjectId(userId));
            }
          }
          break;
        }

        case 'DELETE_FOLDER': {
          const { folderId } = payload;
          if (folderId && !folderId.startsWith('temp-')) {
            await deleteFolderById(folderId, new mongoose.Types.ObjectId(userId), role).catch(() => {});
          }
          break;
        }

        case 'UPDATE_FOLDER': {
          const { folderId, updateData } = payload;
          if (folderId && updateData && !folderId.startsWith('temp-')) {
            await updateFolderById(folderId, updateData, new mongoose.Types.ObjectId(userId), role).catch(() => {});
          }
          break;
        }

        default:
          console.warn(`[Batch Sync] Unknown/unsupported action type: ${action}`);
          break;
      }

      // Mark this mutation as successfully processed
      await ProcessedMutation.create({ mutationId, userId }).catch(() => {});
      processedIds.push(mutationId);
    } catch (err: any) {
      console.error(`[Batch Sync Action Error] Failed processing: ${action} | Error:`, err.message);
      failedIds.push(mutationId);
      // If error is schema validation or type mismatch, classify as permanent failure (poison)
      if (err.name === 'ValidationError' || err.name === 'CastError' || err.message?.includes('Validation failed') || err.message?.includes('not found')) {
        permanentFailures.push(mutationId);
      }
    }
  }

  return successResponse(res, 200, 'Batch actions processed successfully', {
    processedIds,
    failedIds,
    permanentFailures
  });
});
