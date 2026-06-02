import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/responseHandler';
import User from '../models/user.model';

export const sendPushNotificationHandler = asyncHandler(async (req: Request, res: Response) => {
  const { title, body, userId, data } = req.body;

  if (!title || !body) {
    return res.status(400).json({ success: false, message: 'Title and body are required' });
  }

  // 1. Fetch user(s) with active push tokens
  let tokens: string[] = [];
  if (userId) {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.expoPushToken) {
      tokens.push(user.expoPushToken);
    }
  } else {
    // Fetch all users that have an expoPushToken
    const users = await User.find({ expoPushToken: { $ne: null } }).select('expoPushToken');
    tokens = users.map(u => u.expoPushToken).filter(Boolean) as string[];
  }

  if (tokens.length === 0) {
    return successResponse(res, 200, 'No users found with active push tokens', { sentCount: 0 });
  }

  // 2. Prepare Expo Push API payload
  const messages = tokens.map(token => ({
    to: token,
    sound: 'default',
    title,
    body,
    data: data || {},
  }));

  // Expo expects batches of max 100 messages at a time.
  const CHUNK_SIZE = 100;
  const chunks: typeof messages[] = [];
  for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
    chunks.push(messages.slice(i, i + CHUNK_SIZE));
  }

  let successCount = 0;
  let errorCount = 0;

  for (const chunk of chunks) {
    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();
      console.log('[Expo Push] Chunk dispatch response status:', response.status, result);
      
      if (result.data) {
        result.data.forEach((receipt: any) => {
          if (receipt.status === 'ok') {
            successCount++;
          } else {
            errorCount++;
            console.error('[Expo Push] Failed receipt error details:', receipt);
          }
        });
      } else {
        errorCount += chunk.length;
      }
    } catch (fetchErr: any) {
      console.error('[Expo Push] Error sending batch to Expo:', fetchErr.message);
      errorCount += chunk.length;
    }
  }

  return successResponse(res, 200, 'Push notifications dispatched successfully', {
    totalTokens: tokens.length,
    successCount,
    errorCount,
  });
});
