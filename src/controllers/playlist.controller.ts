import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { createPlaylistSchema, playlistItemActionSchema, queryPlaylistSchema } from '../validators/playlist.validator';
import { 
  createPlaylistService, 
  getUserPlaylistsService, 
  getPlaylistByIdService, 
  deletePlaylistService, 
  addPlacardToPlaylistService, 
  removePlacardFromPlaylistService 
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
  const queryParams = queryPlaylistSchema.parse(req.query);
  const result = await getPlaylistByIdService(req.params.id, req.user!._id.toString(), queryParams);
  
  if (!result) return errorResponse(res, 404, 'Playlist not found');
  return successResponse(res, 200, 'Playlist fetched successfully', result);
});

export const deletePlaylist = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await deletePlaylistService(req.params.id, req.user!._id.toString());
  if (!result) return errorResponse(res, 404, 'Playlist not found');
  return successResponse(res, 200, 'Playlist deleted successfully');
});

export const addPlacard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { playlistId, placardId } = playlistItemActionSchema.parse(req.body);
  await addPlacardToPlaylistService(playlistId, placardId, req.user!._id.toString());
  return successResponse(res, 200, 'Item added to playlist');
});

export const removePlacard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { playlistId, placardId } = playlistItemActionSchema.parse(req.body);
  const result = await removePlacardFromPlaylistService(playlistId, placardId, req.user!._id.toString());
  if (!result) return errorResponse(res, 404, 'Item not found in playlist');
  return successResponse(res, 200, 'Item removed from playlist');
});