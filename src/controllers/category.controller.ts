import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { getCategoriesByDomainService, getCategoryBySlugService } from '../services/category.service';
import { querySchema } from '../validators/domain.validator';

export const getCategoriesByDomain = asyncHandler(async (req: Request, res: Response) => {
  const { domainId } = req.params;
  const queryParams = querySchema.parse(req.query);
  
  const result = await getCategoriesByDomainService(domainId, queryParams);
  return successResponse(res, 200, 'Categories fetched successfully', result);
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const category = await getCategoryBySlugService(slug);
  if (!category) {
    return errorResponse(res, 404, 'Category not found');
  }

  return successResponse(res, 200, 'Category fetched successfully', { category });
});