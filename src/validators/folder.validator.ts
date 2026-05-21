import { z } from 'zod';

const folderBodySchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, 'Title is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  visibility: z.enum(['public', 'private']).optional(),
  roleAccess: z.array(z.enum(['user', 'admin', 'superadmin'])).optional(),
  order: z.number().optional(),
  parentFolderId: z.string().nullable().optional(),
});

export const createFolderSchema = z.object({
  body: folderBodySchema,
});

export const updateFolderSchema = z.object({
  body: folderBodySchema.partial(),
  params: z.object({ id: z.string({ required_error: 'Folder ID is required' }) }),
});

export const folderIdParamSchema = z.object({
  params: z.object({ id: z.string({ required_error: 'Folder ID is required' }) }),
});

export const queryFoldersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    parentFolderId: z.string().optional(),
  }),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>['body'];
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>['body'];
export type QueryFoldersInput = z.infer<typeof queryFoldersSchema>['query'];
