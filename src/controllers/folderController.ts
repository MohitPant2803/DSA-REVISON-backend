import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import * as folderService from '../services/folderService';
import { IUser } from '../models/user.model';
import { QueryFoldersInput } from '../validators/folder.validator';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserRole } from '../utils/permissions';

export const createFolderHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const folder = await folderService.createFolder(req.body, req.user!._id);
  res.status(httpStatus.CREATED).json(folder);
});

export const getFoldersHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const role = req.user?.role as UserRole | undefined;
  const result = await folderService.queryFolders(req.query as unknown as QueryFoldersInput, role);
  res.status(httpStatus.OK).json(result);
});

export const getFolderByIdHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const role = req.user?.role as UserRole | undefined;
  const folder = await folderService.getFolderById(req.params.id, role);
  res.status(httpStatus.OK).json(folder);
});

export const updateFolderHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const folder = await folderService.updateFolderById(
    req.params.id,
    req.body,
    req.user!._id,
    req.user!.role as UserRole
  );
  res.status(httpStatus.OK).json(folder);
});

export const deleteFolderHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  await folderService.deleteFolderById(req.params.id, req.user!._id, req.user!.role as UserRole);
  res.status(httpStatus.NO_CONTENT).send();
});

export const reorderFolderCardsHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const folder = await folderService.reorderFolderCards(
    req.params.id,
    req.body.cardIds,
    req.user!._id,
    req.user!.role as UserRole
  );
  res.status(httpStatus.OK).json(folder);
});
