import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import * as revisionService from '../services/revisionService';
import { QueryRevisionCardsInput } from '../validators/revisionCard.validator';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserRole } from '../utils/permissions';

export const createRevisionCardHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const card = await revisionService.createRevisionCard(req.body, req.user!._id);
  res.status(httpStatus.CREATED).json(card);
});

export const getRevisionCardsHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const role = req.user?.role as UserRole | undefined;
  const result = await revisionService.queryRevisionCards(
    req.query as unknown as QueryRevisionCardsInput,
    role
  );
  res.status(httpStatus.OK).json(result);
});

export const getRevisionCardByIdHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const role = req.user?.role as UserRole | undefined;
  const card = await revisionService.getRevisionCardById(req.params.id, role);
  res.status(httpStatus.OK).json(card);
});

export const getCardsByFolderHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const role = req.user?.role as UserRole | undefined;
  const result = await revisionService.getCardsByFolder(
    req.params.folderId,
    req.query as unknown as QueryRevisionCardsInput,
    role
  );
  res.status(httpStatus.OK).json(result);
});

export const updateRevisionCardHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const updatedCard = await revisionService.updateRevisionCardById(
    req.params.id,
    req.body,
    req.user!._id,
    req.user!.role as UserRole
  );
  res.status(httpStatus.OK).json(updatedCard);
});

export const deleteRevisionCardHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  await revisionService.deleteRevisionCardById(
    req.params.id,
    req.user!._id,
    req.user!.role as UserRole
  );
  res.status(httpStatus.NO_CONTENT).send();
});
