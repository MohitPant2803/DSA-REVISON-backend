import { z } from 'zod';

export const updateProgressSchema = z
  .object({
    placardId: z.string().min(1).optional(),
    revisionCardId: z.string().min(1).optional(),
    completed: z.boolean().optional(),
    mcqScore: z.number().min(0).max(100).optional(),
    walkthroughCompleted: z.boolean().optional(),
    timeSpent: z.number().int().min(0).optional(),
    confidenceScore: z.enum(['low', 'medium', 'high']).optional(),
    favorite: z.boolean().optional(),
    difficult: z.boolean().optional(),
    archived: z.boolean().optional(),
    addToPlaylist: z.string().optional(),
    removeFromPlaylist: z.string().optional(),
  })
  .refine((data) => data.placardId || data.revisionCardId, {
    message: 'Either placardId or revisionCardId is required',
  });