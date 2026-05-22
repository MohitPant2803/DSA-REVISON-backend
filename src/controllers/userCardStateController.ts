import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import * as userCardStateService from '../services/userCardStateService';
import { AuthRequest } from '../middleware/authMiddleware';

export const toggleLikeHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cardId } = req.body;
  if (!cardId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'cardId is required' });
    return;
  }
  const state = await userCardStateService.toggleLike(req.user!._id.toString(), cardId);
  res.status(httpStatus.OK).json(state);
});

export const toggleWatchLaterHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cardId } = req.body;
  if (!cardId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'cardId is required' });
    return;
  }
  const state = await userCardStateService.toggleWatchLater(req.user!._id.toString(), cardId);
  res.status(httpStatus.OK).json(state);
});

export const markViewedHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cardId } = req.body;
  if (!cardId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'cardId is required' });
    return;
  }
  const state = await userCardStateService.markViewed(req.user!._id.toString(), cardId);
  res.status(httpStatus.OK).json(state);
});

export const getLikedCardsHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userCardStateService.getLikedCards(req.user!._id.toString(), req.query);
  res.status(httpStatus.OK).json(result);
});

export const getWatchLaterCardsHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await userCardStateService.getWatchLaterCards(req.user!._id.toString(), req.query);
  res.status(httpStatus.OK).json(result);
});

export const getUserCardStateHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cardId } = req.params;
  if (!cardId) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'cardId parameter is required' });
    return;
  }
  const state = await userCardStateService.getUserCardState(req.user!._id.toString(), cardId);
  res.status(httpStatus.OK).json(state);
});
