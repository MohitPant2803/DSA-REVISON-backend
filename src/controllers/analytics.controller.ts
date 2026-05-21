import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseHandler';
import { getAdminAnalyticsService } from '../services/progress.service';
import { AuthRequest } from '../middleware/authMiddleware';

export const getAnalytics = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const analytics = await getAdminAnalyticsService();
  successResponse(res, 200, 'Analytics retrieved', { analytics });
});
