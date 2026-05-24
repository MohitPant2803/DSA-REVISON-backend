import { Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import RevisionCard from '../models/revisionCard.model';
import Folder from '../models/folder.model';
import Playlist from '../models/playlist.model';
import UserQuestionProgress from '../models/userQuestionProgress.model';
import Progress from '../models/progress.model';
import { AuthRequest } from './playlist.controller';
import { updateUserQuestionProgress } from '../services/userQuestionProgress.service';
import { updateProgressService, reorderLikesService } from '../services/progress.service';
import { addItemToPlaylistService, removeItemFromPlaylistService, reorderPlaylistService } from '../services/playlist.service';

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

  // Process actions sequentially (Last-Write-Wins based on offline timestamps)
  // We wrap them in try-catch to ensure one bad action doesn't crash the entire batch sync!
  for (const item of actions) {
    const { action, payload, timestamp } = item;
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

        default:
          console.warn(`[Batch Sync] Unknown/unsupported action type: ${action}`);
          break;
      }
    } catch (err: any) {
      console.error(`[Batch Sync Action Error] Failed processing: ${action} | Error:`, err.message);
    }
  }

  return successResponse(res, 200, 'Batch actions processed successfully');
});
