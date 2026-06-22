import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { googleAuthSchema } from '../validators/auth.validator';
import { verifyGoogleTokenAndLogin } from '../services/auth.service';
import { generateToken } from '../utils/jwt';
import { successResponse } from '../utils/responseHandler';
import { AuthRequest } from '../middleware/authMiddleware';
import { ensureUserSystemPlaylists, logUserPlaylistCatalogSummary } from '../services/playlist.service';

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  console.log("Body received:", req.body);

  try {
    const { idToken, deviceId, clockEpoch } = googleAuthSchema.parse(req.body);

    // Service handles the "Create if new / Login if existing" logic
    const user = await verifyGoogleTokenAndLogin(idToken);
    await ensureUserSystemPlaylists(user._id.toString());
    await logUserPlaylistCatalogSummary(user._id.toString(), user.email);

    if (deviceId) {
      user.lastDeviceId = deviceId;
      user.lastClockEpoch = clockEpoch || '';
      await user.save();
      console.log(`[Auth] Registered active device for user ${user.email}: Device ID ${deviceId}`);
    }

    // Generate session token using the MongoDB _id (persisted either from creation or retrieval)
    const token = generateToken({ userId: user._id.toString(), role: user.role });
    
    const isNewUser = user.createdAt.getTime() === user.updatedAt.getTime();
    console.log(`[Auth] ${isNewUser ? 'New account created' : 'Existing account opened'} for ${user.email}`);

    return successResponse(res, 200, 'Login successful', { user, token, role: user.role });
  } catch (error: any) {
    // Zod puts its validation details inside the `errors` array
    console.log("Validation errors:", JSON.stringify(error.errors || error, null, 2));
    throw error; // Re-throw so your global error handler still returns a 400 response
  }
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const deviceId = req.query.deviceId as string;
  const clockEpoch = req.query.clockEpoch as string;

  if (deviceId && req.user) {
    const User = require('../models/user.model').default;
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        lastDeviceId: deviceId,
        lastClockEpoch: clockEpoch || ''
      }
    });
    console.log(`[Auth] Startup device sync completed for user ${req.user.email}: Device ID ${deviceId}`);
  }

  if (req.user) {
    const User = require('../models/user.model').default;
    const userDoc = await User.findById(req.user._id);
    if (userDoc) {
      const { updateUserStreak } = require('../services/progress.service');
      updateUserStreak(userDoc);
      await userDoc.save();
      req.user = userDoc;
    }
    await ensureUserSystemPlaylists(req.user._id.toString());
  }

  return successResponse(res, 200, 'User profile retrieved successfully', { user: req.user });
});

export const updatePushToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { pushToken } = req.body;
  if (!pushToken) {
    return res.status(400).json({ success: false, message: 'Push token is required' });
  }

  if (req.user) {
    const User = require('../models/user.model').default;
    await User.findByIdAndUpdate(req.user._id, {
      $set: { expoPushToken: pushToken }
    });
    console.log(`[Push Notification] Registered push token for ${req.user.email}`);
    return successResponse(res, 200, 'Push token registered successfully');
  }

  return res.status(401).json({ success: false, message: 'Unauthorized' });
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const userId = req.user._id;

  console.log(`[Account Deletion] Initiating cascading purge for user ${req.user.email} (ID: ${userId})`);

  // Dynamically load models to prevent circular dependency issues
  const User = require('../models/user.model').default;
  const Progress = require('../models/progress.model').default;
  const UserQuestionProgress = require('../models/userQuestionProgress.model').default;
  const Playlist = require('../models/playlist.model').default;
  const Folder = require('../models/folder.model').default;
  const ProcessedMutation = require('../models/processedMutation.model').default;
  const DeletedEntity = require('../models/deletedEntity.model').default;
  const UserCardState = require('../models/userCardState.model').default;
  const UserReelPreference = require('../models/userReelPreference.model').default;
  const UserReelSession = require('../models/userReelSession.model').default;
  const FolderProgress = require('../models/folderProgress.model').default;
  const PlaylistProgress = require('../models/playlistProgress.model').default;

  // Execute deletion across all collections in parallel
  await Promise.all([
    User.findByIdAndDelete(userId),
    Progress.deleteMany({ userId }),
    UserQuestionProgress.deleteMany({ userId }),
    Playlist.deleteMany({ userId }),
    Folder.deleteMany({ createdBy: userId }),
    ProcessedMutation.deleteMany({ userId }),
    DeletedEntity.deleteMany({ userId }),
    UserCardState.deleteMany({ userId }),
    UserReelPreference.deleteMany({ userId }),
    UserReelSession.deleteMany({ userId }),
    FolderProgress.deleteMany({ userId }),
    PlaylistProgress.deleteMany({ userId })
  ]);

  console.log(`[Account Deletion] Successfully deleted user profile and all associated data for ${req.user.email}`);

  return successResponse(res, 200, 'Account deleted successfully');
});
