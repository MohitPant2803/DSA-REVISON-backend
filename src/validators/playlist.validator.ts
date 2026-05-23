import { z } from 'zod';

export const createPlaylistSchema = z.object({
  name: z.string().min(1, 'Playlist name is required'),
  description: z.string().optional(),
  color1: z.string().optional(),
  color2: z.string().optional(),
});

export const playlistItemActionSchema = z
  .object({
    playlistId: z.string().min(1, 'Playlist ID is required'),
    placardId: z.string().min(1).optional(),
    revisionCardId: z.string().min(1).optional(),
  })
  .refine((data) => data.placardId || data.revisionCardId, {
    message: 'Either placardId or revisionCardId is required',
  });

export const queryPlaylistSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional(),
});

export const updatePlaylistSchema = z.object({
  name: z.string().min(1, 'Playlist name is required').optional(),
  description: z.string().optional(),
  color1: z.string().optional(),
  color2: z.string().optional(),
});

