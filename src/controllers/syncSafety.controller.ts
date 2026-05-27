import { Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import User from '../models/user.model';
import { AuthRequest } from './playlist.controller';

/**
 * Emergency administrative endpoint to force a full resync for a specific user.
 * Increments the user's currentRevision counter by 10000, which exceeds the max
 * revision compaction window (5000) and forces the client to wipe and resync.
 */
export const forceFullResync = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return errorResponse(res, 400, 'targetUserId is required');
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return errorResponse(res, 400, 'Invalid targetUserId format');
  }

  const user = await User.findById(targetUserId);
  if (!user) {
    return errorResponse(res, 404, 'Target user not found');
  }

  // Increment currentRevision by 10000 to force a full resync gap
  user.currentRevision = (user.currentRevision || 0) + 10000;
  await user.save();

  console.log(`[Emergency Sync Safety] Forced full resync for user: ${targetUserId}. New currentRevision: ${user.currentRevision}`);

  return successResponse(res, 200, 'Force full resync triggered successfully', {
    userId: targetUserId,
    newCurrentRevision: user.currentRevision,
  });
});
