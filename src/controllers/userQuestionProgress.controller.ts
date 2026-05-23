import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import { AuthRequest } from '../middleware/authMiddleware';
import * as userQuestionProgressService from '../services/userQuestionProgress.service';

export const updateUserQuestionProgressHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { questionId, state } = req.body;

  if (!questionId || state === undefined) {
    res.status(httpStatus.BAD_REQUEST);
    throw new Error('questionId and state are required');
  }

  const result = await userQuestionProgressService.updateUserQuestionProgress(
    req.user!._id.toString(),
    questionId,
    state
  );

  res.status(httpStatus.OK).json({
    message: 'User question progress updated successfully',
    data: result,
  });
});
