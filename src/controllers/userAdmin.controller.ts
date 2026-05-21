import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { z } from 'zod';
import { successResponse } from '../utils/responseHandler';
import { listUsers, updateUserRole } from '../services/userAdmin.service';
import { AuthRequest } from '../middleware/authMiddleware';

const updateRoleSchema = z.object({
  role: z.enum(['user', 'admin', 'superadmin']),
});

export const getUsersHandler = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await listUsers();
  successResponse(res, 200, 'Users retrieved', { users });
});

export const updateUserRoleHandler = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role } = updateRoleSchema.parse(req.body);
  const user = await updateUserRole(req.params.id, role);
  successResponse(res, 200, 'User role updated', { user });
});
