import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { getPlacardsByCategoryService, getPlacardByIdService } from '../services/placard.service';
import { queryPlacardSchema } from '../validators/placard.validator';

export const getPlacardsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const queryParams = queryPlacardSchema.parse(req.query);
  
  const result = await getPlacardsByCategoryService(categoryId, queryParams, true); // true = requirePublished
  return successResponse(res, 200, 'Placards fetched successfully', result);
});

export const getPlacardById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const placard = await getPlacardByIdService(id);
  if (!placard || !placard.isPublished) {
    return errorResponse(res, 404, 'Placard not found');
  }

  return successResponse(res, 200, 'Placard fetched successfully', { placard });
});