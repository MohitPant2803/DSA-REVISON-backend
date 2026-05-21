import { z } from 'zod';

export const toggleBookmarkSchema = z.object({
  placardId: z.string().min(1, 'Placard ID is required'),
});