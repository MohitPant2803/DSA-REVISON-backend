import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().url('MONGO_URI must be a valid URL').min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_ANDROID_CLIENT_ID: z.string().optional(),
  SUPERADMIN_EMAIL: z.string().email().optional(),
  ALLOWED_ORIGINS: z.string().default('*'), // Comma separated for multiple frontends
  LATEST_APP_VERSION: z.string().default('1.0.2'),
  APP_UPDATE_URL: z.string().url().default('https://github.com/MohitPant2803/DSA-REVISON-frontend/releases/download/ReeWise3/app-arm64-v8a-release.apk'),
  APP_SHARE_MESSAGE: z.string().default("Here's the link of the cool app you were asking about 😉 \n\n{updateUrl}"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(_env.error.format(), null, 2)
  );
  process.exit(1);
}

export const env = {
  ..._env.data,
  isDev: _env.data.NODE_ENV === 'development',
  isProd: _env.data.NODE_ENV === 'production',
  isTest: _env.data.NODE_ENV === 'test',
};