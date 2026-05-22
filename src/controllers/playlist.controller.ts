import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { createPlaylistSchema, playlistItemActionSchema, queryPlaylistSchema } from '../validators/playlist.validator';
import {
  createPlaylistService,
  getUserPlaylistsService,
  getPlaylistByIdService,
  deletePlaylistService,
  addItemToPlaylistService,
  removeItemFromPlaylistService,
} from '../services/playlist.service';

export interface AuthRequest extends Request {
  user?: any;
}

export const createPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payload = createPlaylistSchema.parse(req.body);
  const playlist = await createPlaylistService(req.user!._id.toString(), payload);
  return successResponse(res, 201, 'Playlist created successfully', { playlist });
});

export const getPlaylists = asyncHandler(async (req: AuthRequest, res: Response) => {
  const playlists = await getUserPlaylistsService(req.user!._id.toString());
  return successResponse(res, 200, 'Playlists fetched successfully', { playlists });
});

export const getPlaylistById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getPlaylistByIdService(req.params.id, req.user!._id.toString());

  if (!result) return errorResponse(res, 404, 'Playlist not found');
  return successResponse(res, 200, 'Playlist fetched successfully', result);
});

export const deletePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await deletePlaylistService(req.params.id, req.user!._id.toString());
  if (!result) return errorResponse(res, 404, 'Playlist not found');
  return successResponse(res, 200, 'Playlist deleted successfully');
});

export const addPlacard = asyncHandler(async (req: AuthRequest, res: Response) => {
  try {
    const { playlistId, placardId, revisionCardId } = playlistItemActionSchema.parse(req.body);
    await addItemToPlaylistService(playlistId, req.user!._id.toString(), {
      placardId,
      revisionCardId,
    });
    return successResponse(res, 200, 'Item added to playlist');
  } catch (error: any) {
    if (error.message === 'Item already exists in playlist') {
      return errorResponse(res, 400, error.message);
    }
    throw error;
  }
});

export const removePlacard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { playlistId, placardId, revisionCardId } = playlistItemActionSchema.parse(req.body);
  const result = await removeItemFromPlaylistService(playlistId, req.user!._id.toString(), {
    placardId,
    revisionCardId,
  });
  if (!result) return errorResponse(res, 404, 'Item not found in playlist');
  return successResponse(res, 200, 'Item removed from playlist');
});

export const reorderPlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cardIds } = req.body;
  const { id } = req.params;
  
  if (!Array.isArray(cardIds)) {
    return errorResponse(res, 400, 'cardIds must be an array of strings');
  }

  const { reorderPlaylistService } = require('../services/playlist.service');
  const playlist = await reorderPlaylistService(id, req.user!._id.toString(), cardIds);
  return successResponse(res, 200, 'Playlist reordered successfully', { playlist });
});
