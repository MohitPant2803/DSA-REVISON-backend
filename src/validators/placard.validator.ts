import { z } from 'zod';

const WalkthroughStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string().min(1),
  explanation: z.string().min(1),
  code: z.string().optional(),
  insight: z.string().optional(),
  timeComplexity: z.string().optional(),
  spaceComplexity: z.string().optional(),
});

const McqSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string().optional(),
});

export const createPlacardSchema = z.object({
  domainId: z.string().min(1, 'Domain ID is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(), // Will auto-generate if missing
  topic: z.string().min(1, 'Topic is required'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Easy', 'Medium', 'Hard']),
  tags: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  estimatedTime: z.number().int().min(1).default(15),
  companiesAsked: z.array(z.string()).default([]),
  question: z.string().min(1, 'Question content is required'),
  hints: z.array(z.string()).default([]),
  mcqs: z.array(McqSchema).default([]),
  walkthrough: z.array(WalkthroughStepSchema).default([]),
  revisionSummary: z.string().optional(),
  commonMistakes: z.array(z.string()).default([]),
  relatedPatterns: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export const updatePlacardSchema = createPlacardSchema.partial();

export const queryPlacardSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // Comma separated tags
  difficulty: z.string().optional(),
});

export type CreatePlacardInput = z.infer<typeof createPlacardSchema>;