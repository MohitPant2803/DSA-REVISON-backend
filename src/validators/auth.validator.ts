import { z } from 'zod';

export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'Google ID Token is required'),
  deviceId: z.string().optional(),
  clockEpoch: z.string().optional(),
});