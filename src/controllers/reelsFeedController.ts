import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import * as reelsFeedService from '../services/reelsFeedService';
import { AuthRequest } from '../middleware/authMiddleware';

// 1. Get user root folder study preferences
export const getUserPreferencesHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const prefs = await reelsFeedService.getUserPreferences(req.user!._id.toString());
  res.status(httpStatus.OK).json(prefs);
});

// 2. Update user root folder study preferences with server-side validations
export const updateUserPreferencesHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { selectedRootFolderIds } = req.body;
  if (!selectedRootFolderIds || !Array.isArray(selectedRootFolderIds)) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'selectedRootFolderIds must be a non-empty array' });
    return;
  }

  const prefs = await reelsFeedService.updateUserPreferences(
    req.user!._id.toString(),
    selectedRootFolderIds
  );
  res.status(httpStatus.OK).json(prefs);
});

// 3. Serve current sliding slice window of cards
export const getSessionSliceHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const slice = await reelsFeedService.getSessionSlice(req.user!._id.toString());
  res.status(httpStatus.OK).json(slice);
});

// 4. Update session scroll index (Purged: Memory-Only Architecture)
export const updateSessionIndexHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(httpStatus.OK).json({ success: true, message: 'Session index is now memory-only. Persistence bypassed.' });
});

// 5. Explicitly invalidate/regenerate clean deterministic queue
export const regenerateSessionQueueHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const session = await reelsFeedService.generateReelsQueue(req.user!._id.toString());
  res.status(httpStatus.OK).json(session);
});
