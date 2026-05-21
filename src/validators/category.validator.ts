import { z } from 'zod';

export const createCategorySchema = z.object({
  domainId: z.string().min(1, 'Domain ID is required'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  estimatedHours: z.number().min(0).optional(),
  totalPlacards: z.number().int().min(0).optional(),
  order: z.number().int().optional(),
});