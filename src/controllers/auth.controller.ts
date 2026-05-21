import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { googleAuthSchema } from '../validators/auth.validator';
import { verifyGoogleTokenAndLogin } from '../services/auth.service';
import { generateToken } from '../utils/jwt';
import { successResponse } from '../utils/responseHandler';
import { AuthRequest } from '../middleware/authMiddleware';

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  console.log("Body received:", req.body);

  try {
    const { idToken } = googleAuthSchema.parse(req.body);

    const user = await verifyGoogleTokenAndLogin(idToken);
    const token = generateToken({ userId: user._id.toString(), role: user.role });

    return successResponse(res, 200, 'Login successful', { user, token });
  } catch (error: any) {
    // Zod puts its validation details inside the `errors` array
    console.log("Validation errors:", JSON.stringify(error.errors || error, null, 2));
    throw error; // Re-throw so your global error handler still returns a 400 response
  }
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  return successResponse(res, 200, 'User profile retrieved successfully', { user: req.user });
});