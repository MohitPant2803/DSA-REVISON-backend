import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseHandler';
import { updateProgressSchema } from '../validators/progress.validator';
import {
  updateProgressService,
  getDashboardStatsService,
  getPersonalLibraryService,
} from '../services/progress.service';
import { AuthRequest } from '../middleware/authMiddleware';

export const updateProgress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payload = updateProgressSchema.parse(req.body);
  const progress = await updateProgressService(req.user!._id.toString(), payload);
  successResponse(res, 200, 'Progress updated successfully', { progress });
});

export const getMyStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await getDashboardStatsService(req.user!._id.toString());
  successResponse(res, 200, 'User stats fetched successfully', { stats });
});

export const getPersonalLibrary = asyncHandler(async (req: AuthRequest, res: Response) => {
  const library = await getPersonalLibraryService(req.user!._id.toString());
  successResponse(res, 200, 'Personal library fetched', { library });
});
