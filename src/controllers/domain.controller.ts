import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/responseHandler';
import { getDomainsService, getDomainBySlugService } from '../services/domain.service';
import { querySchema } from '../validators/domain.validator';

export const getDomains = asyncHandler(async (req: Request, res: Response) => {
  const queryParams = querySchema.parse(req.query);
  const result = await getDomainsService(queryParams);
  
  return successResponse(res, 200, 'Domains fetched successfully', result);
});

export const getDomainBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  const domain = await getDomainBySlugService(slug);
  
  if (!domain) {
    return errorResponse(res, 404, 'Domain not found');
  }

  return successResponse(res, 200, 'Domain fetched successfully', { domain });
});