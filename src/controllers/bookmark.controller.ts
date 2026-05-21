import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseHandler';
import { toggleBookmarkService, getUserBookmarksService } from '../services/bookmark.service';
import { toggleBookmarkSchema } from '../validators/bookmark.validator';

export interface AuthRequest extends Request {
  user?: any;
}

export const toggleBookmark = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { placardId } = toggleBookmarkSchema.parse(req.body);
  const result = await toggleBookmarkService(req.user!._id.toString(), placardId);
  return successResponse(res, 200, result.message, { isBookmarked: result.isBookmarked });
});

export const getBookmarks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getUserBookmarksService(req.user!._id.toString(), req.query);
  return successResponse(res, 200, 'Bookmarks fetched successfully', result);
});