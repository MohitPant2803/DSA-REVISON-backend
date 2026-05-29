import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseHandler';
import { updateProgressSchema } from '../validators/progress.validator';
import * as folderService from '../services/folderService';
import {
  updateProgressService,
  getDashboardStatsService,
  getPersonalLibraryService,
  registerLoopService,
  getFolderLoopsService,
  updateResumeStateService,
  getResumeStateService,
  reorderLikesService,
  syncAnalyticsService,
} from '../services/progress.service';
import { AuthRequest } from '../middleware/authMiddleware';

export const updateProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payload = updateProgressSchema.parse(req.body);
  const progress = await updateProgressService(req.user!._id.toString(), payload);
  successResponse(res, 200, 'Progress updated successfully', { progress });
});

export const getMyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id.toString();
  // Trigger background count reconciliation dynamically to keep seen/total counts drift-free
  folderService.reconcileFolderCounts(userId).catch(err => console.error('[Reconcile Progress Counts Error]', err));

  const stats = await getDashboardStatsService(userId);
  successResponse(res, 200, 'User stats fetched successfully', { stats });
});

export const getPersonalLibrary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const library = await getPersonalLibraryService(req.user!._id.toString());
  successResponse(res, 200, 'Personal library fetched', { library });
});

export const registerLoop = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, id, cardsViewed } = req.body;
  if (!type || !id || typeof cardsViewed !== 'number') {
    res.status(400);
    throw new Error('Invalid request payload for loop registration');
  }
  const loopStats = await registerLoopService(req.user!._id.toString(), type as any, id, cardsViewed);
  successResponse(res, 200, 'Loop registered successfully', { loopStats });
});

export const getFolderLoops = asyncHandler(async (req: AuthRequest, res: Response) => {
  const loops = await getFolderLoopsService(req.user!._id.toString());
  successResponse(res, 200, 'Folder loops fetched successfully', { loops });
});

export const updateResumeState = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, id, resumeData } = req.body;
  if (!type || !id || !resumeData) {
    res.status(400);
    throw new Error('Invalid request payload for resume state update');
  }
  const result = await updateResumeStateService(req.user!._id.toString(), type as any, id, resumeData);
  successResponse(res, 200, 'Resume state updated successfully', { result });
});

export const getResumeStates = asyncHandler(async (req: AuthRequest, res: Response) => {
  const states = await getResumeStateService(req.user!._id.toString());
  successResponse(res, 200, 'Resume states fetched successfully', { states });
});

export const reorderLikes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cardIds } = req.body;
  if (!Array.isArray(cardIds)) {
    res.status(400);
    throw new Error('cardIds must be an array of strings');
  }
  await reorderLikesService(req.user!._id.toString(), cardIds);
  successResponse(res, 200, 'Likes reordered successfully');
});

export const syncAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { swipes, scrolls } = req.body;
  if (typeof swipes !== 'number' || typeof scrolls !== 'number') {
    res.status(400);
    throw new Error('swipes and scrolls must be numbers');
  }
  const result = await syncAnalyticsService(req.user!._id.toString(), swipes, scrolls);
  successResponse(res, 200, 'Analytics synced successfully', { result });
});
