import { z } from 'zod';

const optionalUrl = z
  .string()
  .optional()
  .transform((val) => (val === '' ? undefined : val))
  .refine((val) => val === undefined || z.string().url().safeParse(val).success, {
    message: 'Invalid URL format',
  });

const slideSchema = z.object({
  type: z.string().optional(),
  headline: z.string({ required_error: 'Headline is required' }).min(1, 'Headline is required'),
  body: z.string().optional(),
  code: z.string().optional(),
  blocks: z.array(z.any()).optional().default([]),
});

const bodySchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title is required'),
  topic: z.string({ required_error: 'Topic is required' }).min(1, 'Topic is required'),
  explanation: z.string({ required_error: 'Explanation is required' }).min(1, 'Explanation is required'),
  code: z.string().optional(),
  image: optionalUrl,
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(['Easy', 'Medium', 'Hard'], { required_error: 'Difficulty is required' }),
  complexity: z
    .enum(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2^n)'])
    .optional(),
  examples: z.array(z.string()).default([]),
  folderId: z.string({ required_error: 'Folder is required' }).min(1, 'Folder is required'),
  visibility: z.enum(['public', 'private']).optional(),
  order: z.number().optional(),
  slides: z.array(slideSchema).optional(),
});

export const createRevisionCardSchema = z.object({
  body: bodySchema,
});

export const updateRevisionCardSchema = z.object({
  body: bodySchema.partial(),
  params: z.object({ id: z.string({ required_error: 'Card ID is required' }) }),
});

export const revisionCardIdParamSchema = z.object({
  params: z.object({ id: z.string({ required_error: 'Card ID is required' }) }),
});

export const folderCardsParamSchema = z.object({
  params: z.object({ folderId: z.string({ required_error: 'Folder ID is required' }) }),
});

export const queryRevisionCardsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
    search: z.string().optional(),
    topic: z.string().optional(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    folderId: z.string().optional(),
    tags: z.string().optional(),
    excludeSlides: z.string().optional(),
    userDifficultyStates: z.string().optional(),
  }),
});

export const folderCardsQuerySchema = z.object({
  params: z.object({ folderId: z.string({ required_error: 'Folder ID is required' }) }),
  query: queryRevisionCardsSchema.shape.query,
});

export type CreateRevisionCardInput = z.infer<typeof createRevisionCardSchema>['body'];
export type UpdateRevisionCardInput = z.infer<typeof updateRevisionCardSchema>['body'];
export type QueryRevisionCardsInput = z.infer<typeof queryRevisionCardsSchema>['query'];
