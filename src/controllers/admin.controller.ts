// LEGACY_DO_NOT_USE
// This controller is kept for legacy reference but has been disabled to allow database schema cleanup.
//
// import { Request, Response } from 'express';
// import { asyncHandler } from '../utils/asyncHandler';
// import { successResponse } from '../utils/responseHandler';
// import { createDomainSchema } from '../validators/domain.validator';
// import { createCategorySchema } from '../validators/category.validator';
// import { createPlacardSchema, updatePlacardSchema } from '../validators/placard.validator';
// import { createDomainService } from '../services/domain.service';
// import { createCategoryService } from '../services/category.service';
// import { createPlacardService, updatePlacardService, deletePlacardService } from '../services/placard.service';
// 
// export interface AuthRequest extends Request {
//   user?: any;
// }
// 
// export const createDomain = asyncHandler(async (req: Request, res: Response) => {
//   const payload = createDomainSchema.parse(req.body);
//   const domain = await createDomainService(payload);
//   return successResponse(res, 201, 'Domain created successfully', { domain });
// });
// 
// export const createCategory = asyncHandler(async (req: Request, res: Response) => {
//   const payload = createCategorySchema.parse(req.body);
//   const category = await createCategoryService(payload);
//   return successResponse(res, 201, 'Category created successfully', { category });
// });
// 
// export const createPlacard = asyncHandler(async (req: AuthRequest, res: Response) => {
//   const payload = createPlacardSchema.parse(req.body);
//   const placard = await createPlacardService(payload, req.user!._id.toString());
//   return successResponse(res, 201, 'Placard created successfully', { placard });
// });
// 
// export const updatePlacard = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const payload = updatePlacardSchema.parse(req.body);
//   const placard = await updatePlacardService(id, payload);
//   if (!placard) {
//     return res.status(404).json({ success: false, message: 'Placard not found' });
//   }
//   return successResponse(res, 200, 'Placard updated successfully', { placard });
// });
// 
// export const deletePlacard = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const deleted = await deletePlacardService(id);
//   if (!deleted) return res.status(404).json({ success: false, message: 'Placard not found' });
//   return successResponse(res, 200, 'Placard deleted successfully');
// });