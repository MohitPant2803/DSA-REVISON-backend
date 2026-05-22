import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import * as sessionQueueService from '../services/sessionQueueService';
import { AuthRequest } from '../middleware/authMiddleware';

export const createSessionHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sourceType, sourceId, shuffle } = req.body;
  if (!sourceType || !sourceId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'sourceType and sourceId are required' });
    return;
  }
  const session = await sessionQueueService.createSession(
    req.user!._id.toString(),
    sourceType,
    sourceId,
    { shuffle }
  );
  res.status(httpStatus.CREATED).json(session);
});

export const getSessionHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const session = await sessionQueueService.getSessionQueue(
    req.user!._id.toString(),
    req.params.id
  );
  res.status(httpStatus.OK).json(session);
});

export const updateSessionIndexHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentIndex } = req.body;
  if (currentIndex === undefined) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'currentIndex is required' });
    return;
  }
  const session = await sessionQueueService.updateSessionIndex(
    req.user!._id.toString(),
    req.params.id,
    currentIndex
  );
  res.status(httpStatus.OK).json(session);
});

export const toggleSessionShuffleHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shuffle } = req.body;
  if (shuffle === undefined) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'shuffle (boolean) is required' });
    return;
  }
  const session = await sessionQueueService.toggleSessionShuffle(
    req.user!._id.toString(),
    req.params.id,
    shuffle
  );
  res.status(httpStatus.OK).json(session);
});

export const getSessionCardsSliceHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const slice = await sessionQueueService.getSessionCardsSlice(
    req.user!._id.toString(),
    req.params.id
  );
  res.status(httpStatus.OK).json(slice);
});
