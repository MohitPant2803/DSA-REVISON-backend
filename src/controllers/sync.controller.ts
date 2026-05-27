import { Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { getNextUserRevision } from '../utils/revision.utility';
import DeletedEntity from '../models/deletedEntity.model';
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

const CURRENT_DB_VERSION = 'striver-sde-sheet-v4';

export const handleDeltaSync = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const sinceRevisionStr = req.query.sinceRevision as string;
  
  if (sinceRevisionStr !== undefined) {
    const sinceRevision = Number(sinceRevisionStr || 0);
    const currentRevision = (req.user as any).currentRevision || 0;

    // Window Compaction protection: if client is too far behind, force a clean full resync
    if (sinceRevision > 0 && currentRevision - sinceRevision > 5000) {
      return successResponse(res, 200, 'Full resync required due to compaction window limit', {
        requiresFullResync: true,
        currentRevision,
      });
    }

    const sinceDate = req.query.since ? new Date(req.query.since as string) : new Date(0);
    
    // Fetch all entities that have been modified since the client's last revision
    // For global entities (RevisionCard) and public folders, we fallback to updatedAt
    const [cards, folders, playlists, questionProgress, progress, deletedEntities] = await Promise.all([
      RevisionCard.find({ updatedAt: { $gt: sinceDate } }).lean(),
      Folder.find({
        $or: [
          { createdBy: userId, revision: { $gt: sinceRevision } },
          { visibility: 'public', updatedAt: { $gt: sinceDate } }
        ]
      }).lean(),
      Playlist.find({ userId, revision: { $gt: sinceRevision } }).lean(),
      UserQuestionProgress.find({ userId, updatedAt: { $gt: sinceDate } }).lean(),
      Progress.find({ userId, revision: { $gt: sinceRevision } }).lean(),
      DeletedEntity.find({ userId, revision: { $gt: sinceRevision } }).lean(),
    ]);

    // Cryptographic Checksum Fingerprint calculation of all current user-owned ObjectIds
    const [activePlaylists, activeFolders] = await Promise.all([
      Playlist.find({ userId }).select('_id').sort({ _id: 1 }).lean(),
      Folder.find({ createdBy: userId }).select('_id').sort({ _id: 1 }).lean()
    ]);

    const playlistIds = activePlaylists.map(p => p._id.toString()).sort();
    const folderIds = activeFolders.map(f => f._id.toString()).sort();
    const hashInput = JSON.stringify({ playlistIds, folderIds });
    const checksum = crypto.createHash('sha256').update(hashInput).digest('hex');

    return successResponse(res, 200, 'Sync delta fetched successfully', {
      requiresFullResync: false,
      fromRevision: sinceRevision,
      toRevision: currentRevision,
      dbVersion: CURRENT_DB_VERSION,
      checksum,
      audit: {
        playlistCount: activePlaylists.length,
        folderCount: activeFolders.length
      },
      delta: {
        cards,
        folders,
        playlists,
        questionProgress,
        progress,
        deletedEntities
      },
    });
  }

  // Legacy Timestamp-Based Sync Path
  const sinceStr = req.query.since as string;
  const since = sinceStr ? new Date(sinceStr) : new Date(0);

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
  const idTranslations: Record<string, string> = {};

  // Batch actions in chunks of 30 to protect MongoDB from write locks
  const CHUNK_SIZE = 30;
  const chunks: any[][] = [];
  for (let i = 0; i < actions.length; i += CHUNK_SIZE) {
    chunks.push(actions.slice(i, i + CHUNK_SIZE));
  }

  console.log(`[Batch Sync Actions] Processing ${actions.length} actions in ${chunks.length} transaction chunks...`);

  for (const chunk of chunks) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of chunk) {
        const { id: mutationId, action, payload, deviceId = 'legacy-device', logicalSequence = 0 } = item;

        if (!mutationId) continue;

        // Idempotency: Atomic Pre-Insert Lock
        try {
          await ProcessedMutation.create([{ mutationId, userId, deviceId }], { session });
        } catch (err: any) {
          if (err.code === 11000) {
            console.log(`[Batch Sync Idempotency] Skipping duplicate/concurrent mutation lock: ${mutationId}`);
            // Retrieve previously committed translation mappings so they aren't lost on retry attempts
            const existing = await ProcessedMutation.findOne({ mutationId, userId, deviceId });
            if (existing && existing.translations) {
              Object.assign(idTranslations, existing.translations);
            }
            processedIds.push(mutationId);
            continue;
          }
          throw err;
        }

        try {
          console.log(`[Batch Sync Action] Transaction processing: ${action} | User: ${userId} | Device: ${deviceId} | Seq: ${logicalSequence}`);

          switch (action) {
            case 'CLASSIFY_CARD': {
              const { cardId, state } = payload;
              if (cardId) {
                const nextRev = await getNextUserRevision(userId, session);
                const clientSeq = Number(logicalSequence || 0);

                const doc = await Progress.findOne({ userId, revisionCardId: cardId }).session(session);
                if (!doc || clientSeq > (doc.difficultyLogicalSequence || 0)) {
                  await updateUserQuestionProgress(userId, cardId, state);
                  await Progress.findOneAndUpdate(
                    { userId, revisionCardId: cardId },
                    { 
                      $set: { 
                        difficultyState: state,
                        difficultyLogicalSequence: clientSeq,
                        revision: nextRev
                      } 
                    },
                    { upsert: true, new: true, session }
                  );
                } else {
                  console.log(`[CRDT-lite Lock] Discarding classification for card: ${cardId}. Out-of-order sequence.`);
                }
              }
              break;
            }

            case 'TOGGLE_FAVORITE': {
              const { cardId, value } = payload;
              if (cardId) {
                const nextRev = await getNextUserRevision(userId, session);
                const clientSeq = Number(logicalSequence || 0);

                const doc = await Progress.findOne({ userId, revisionCardId: cardId }).session(session);
                if (!doc || clientSeq > (doc.favoriteLogicalSequence || 0)) {
                  await Progress.findOneAndUpdate(
                    { userId, revisionCardId: cardId },
                    { 
                      $set: { 
                        favorite: value,
                        favoriteLogicalSequence: clientSeq,
                        revision: nextRev
                      } 
                    },
                    { upsert: true, new: true, session }
                  );
                } else {
                  console.log(`[CRDT-lite Lock] Discarding favorite toggle for card: ${cardId}. Out-of-order sequence.`);
                }
              }
              break;
            }

            case 'TOGGLE_PLAYLIST_ITEM': {
              const { playlistId, cardId, value } = payload;
              if (playlistId && cardId) {
                const resolvedPlaylistId = idTranslations[playlistId] || playlistId;
                if (resolvedPlaylistId.startsWith('temp-')) {
                  console.warn(`[Batch Sync ID Mismatch] Missing translation mapping for toggle: ${playlistId}. Skipping.`);
                  break;
                }

                const nextRev = await getNextUserRevision(userId, session);
                if (value) {
                  await addItemToPlaylistService(resolvedPlaylistId, userId, { revisionCardId: cardId }).catch(() => {});
                } else {
                  await removeItemFromPlaylistService(resolvedPlaylistId, userId, { revisionCardId: cardId }).catch(() => {});
                }
                await Playlist.findByIdAndUpdate(resolvedPlaylistId, { $set: { revision: nextRev } }, { session });
              }
              break;
            }

            case 'REORDER_PLAYLIST': {
              const { playlistId, cardIds } = payload;
              const resolvedPlaylistId = idTranslations[playlistId] || playlistId;
              if (resolvedPlaylistId && Array.isArray(cardIds) && !resolvedPlaylistId.startsWith('temp-')) {
                const nextRev = await getNextUserRevision(userId, session);
                await reorderPlaylistService(resolvedPlaylistId, userId, cardIds);
                await Playlist.findByIdAndUpdate(resolvedPlaylistId, { $set: { revision: nextRev } }, { session });
              }
              break;
            }

            case 'REORDER_LIKES': {
              const { cardIds } = payload;
              if (Array.isArray(cardIds)) {
                const nextRev = await getNextUserRevision(userId, session);
                await reorderLikesService(userId, cardIds);
                // Also update generic progress document revisions
                await Progress.updateMany({ userId, favorite: true }, { $set: { revision: nextRev } }, { session });
              }
              break;
            }

            case 'CREATE_PLAYLIST': {
              const { tempId, name, color1, color2 } = payload;
              if (name) {
                const existing = await Playlist.findOne({ userId, name }).session(session);
                if (!existing) {
                  const nextRev = await getNextUserRevision(userId, session);
                  const playlist = await createPlaylistService(userId, { name, color1, color2 });
                  
                  await Playlist.findByIdAndUpdate(playlist._id, { $set: { revision: nextRev } }, { session });
                  
                  if (tempId) {
                    const realId = playlist._id.toString();
                    idTranslations[tempId] = realId;
                    console.log(`[Batch Sync ID Map] Mapped temporary playlist ID: ${tempId} -> ${realId}`);
                    // Save translation side-effect inside ProcessedMutation lock document!
                    await ProcessedMutation.findOneAndUpdate(
                      { mutationId, userId, deviceId },
                      { $set: { translations: { [tempId]: realId } } },
                      { session }
                    );
                  }
                } else {
                  if (tempId) {
                    const realId = existing._id.toString();
                    idTranslations[tempId] = realId;
                    await ProcessedMutation.findOneAndUpdate(
                      { mutationId, userId, deviceId },
                      { $set: { translations: { [tempId]: realId } } },
                      { session }
                    );
                  }
                }
              }
              break;
            }

            case 'DELETE_PLAYLIST': {
              const { playlistId } = payload;
              const resolvedPlaylistId = idTranslations[playlistId] || playlistId;
              if (resolvedPlaylistId && !resolvedPlaylistId.startsWith('temp-')) {
                const nextRev = await getNextUserRevision(userId, session);
                await deletePlaylistService(resolvedPlaylistId, userId);
                await DeletedEntity.create([{ userId, entityId: resolvedPlaylistId, entityType: 'playlist', revision: nextRev }], { session });
              }
              break;
            }

            case 'UPDATE_PLAYLIST': {
              const { playlistId, name } = payload;
              const resolvedPlaylistId = idTranslations[playlistId] || playlistId;
              if (resolvedPlaylistId && name && !resolvedPlaylistId.startsWith('temp-')) {
                const nextRev = await getNextUserRevision(userId, session);
                await updatePlaylistService(resolvedPlaylistId, userId, { name });
                await Playlist.findByIdAndUpdate(resolvedPlaylistId, { $set: { revision: nextRev } }, { session });
              }
              break;
            }

            case 'CREATE_FOLDER': {
              const { tempId, dto } = payload;
              if (dto && dto.title) {
                const existing = await Folder.findOne({ createdBy: userId, title: dto.title }).session(session);
                if (!existing) {
                  const nextRev = await getNextUserRevision(userId, session);
                  const folder = await createFolder(dto, new mongoose.Types.ObjectId(userId));
                  
                  await Folder.findByIdAndUpdate(folder._id, { $set: { revision: nextRev } }, { session });
                  
                  if (tempId) {
                    const realId = folder._id.toString();
                    idTranslations[tempId] = realId;
                    console.log(`[Batch Sync ID Map] Mapped temporary folder ID: ${tempId} -> ${realId}`);
                    // Save translation side-effect inside ProcessedMutation lock document!
                    await ProcessedMutation.findOneAndUpdate(
                      { mutationId, userId, deviceId },
                      { $set: { translations: { [tempId]: realId } } },
                      { session }
                    );
                  }
                } else {
                  if (tempId) {
                    const realId = existing._id.toString();
                    idTranslations[tempId] = realId;
                    await ProcessedMutation.findOneAndUpdate(
                      { mutationId, userId, deviceId },
                      { $set: { translations: { [tempId]: realId } } },
                      { session }
                    );
                  }
                }
              }
              break;
            }

            case 'DELETE_FOLDER': {
              const { folderId } = payload;
              const resolvedFolderId = idTranslations[folderId] || folderId;
              if (resolvedFolderId && !resolvedFolderId.startsWith('temp-')) {
                const nextRev = await getNextUserRevision(userId, session);
                await deleteFolderById(resolvedFolderId, new mongoose.Types.ObjectId(userId), role);
                await DeletedEntity.create([{ userId, entityId: resolvedFolderId, entityType: 'folder', revision: nextRev }], { session });
              }
              break;
            }

            case 'UPDATE_FOLDER': {
              const { folderId, updateData } = payload;
              const resolvedFolderId = idTranslations[folderId] || folderId;
              if (resolvedFolderId && updateData && !resolvedFolderId.startsWith('temp-')) {
                const nextRev = await getNextUserRevision(userId, session);
                await updateFolderById(resolvedFolderId, updateData, new mongoose.Types.ObjectId(userId), role);
                await Folder.findByIdAndUpdate(resolvedFolderId, { $set: { revision: nextRev } }, { session });
              }
              break;
            }

            case 'CREATE_CARD': {
              if (role !== 'admin' && role !== 'superadmin') {
                throw new Error('Unauthorized: only admin/superadmin can create cards');
              }
              const { dto } = payload;
              if (dto && dto.title) {
                const existing = await RevisionCard.findOne({ createdBy: userId, title: dto.title }).session(session);
                if (!existing) {
                  await RevisionCard.create([{ ...dto, createdBy: userId }], { session });
                }
              }
              break;
            }

            case 'UPDATE_CARD': {
              if (role !== 'admin' && role !== 'superadmin') {
                throw new Error('Unauthorized: only admin/superadmin can update cards');
              }
              const { cardId, updateData } = payload;
              if (cardId && updateData && !cardId.startsWith('temp-')) {
                await RevisionCard.findByIdAndUpdate(cardId, updateData).session(session);
              }
              break;
            }

            case 'DELETE_CARD': {
              if (role !== 'admin' && role !== 'superadmin') {
                throw new Error('Unauthorized: only admin/superadmin can delete cards');
              }
              const { cardId } = payload;
              if (cardId && !cardId.startsWith('temp-')) {
                await RevisionCard.findByIdAndDelete(cardId).session(session);
              }
              break;
            }

            default:
              console.warn(`[Batch Sync] Unknown/unsupported action type: ${action}`);
              break;
          }

          processedIds.push(mutationId);
        } catch (err: any) {
          console.error(`[Batch Sync Action Error] Failed processing: ${action} | Error:`, err.message);
          failedIds.push(mutationId);
          if (err.name === 'ValidationError' || err.name === 'CastError' || err.message?.includes('Validation failed') || err.message?.includes('not found')) {
            permanentFailures.push(mutationId);
          }
        }
      }

      await session.commitTransaction();
    } catch (chunkErr: any) {
      console.error(`[Batch Sync Chunk Error] Aborting transaction chunk:`, chunkErr.message);
      await session.abortTransaction();
      // Mark mutations in failed chunk
      chunk.forEach((item) => {
        if (!processedIds.includes(item.id)) {
          failedIds.push(item.id);
        }
      });
    } finally {
      await session.endSession();
    }
  }

  return successResponse(res, 200, 'Batch actions processed successfully', {
    processedIds,
    failedIds,
    permanentFailures,
    idTranslations
  });
});
