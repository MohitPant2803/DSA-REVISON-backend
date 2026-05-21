import { z } from 'zod';

export const createDomainSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().optional(),
  icon: z.string().optional(),
  gradient: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  isActive: z.string().optional(),
  search: z.string().optional(),
});

export type CreateDomainInput = z.infer<typeof createDomainSchema>;
export type QueryInput = z.infer<typeof querySchema>;