import { Redis } from 'ioredis';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Initialize Redis only if configured, otherwise use a dummy fallback for local dev
const redisClient = process.env.REDIS_URI 
  ? new Redis(process.env.REDIS_URI) 
  : null;

if (redisClient) {
  redisClient.on('error', (err: Error) => logger.error('Redis connection error:', err));
  redisClient.on('connect', () => logger.info('✅ Redis Cache connected'));
}

export const CacheService = {
  async get<T>(key: string): Promise<T | null> {
    if (!redisClient) return null;
    const data = await redisClient.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  },

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (!redisClient) return;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.set(key, stringValue, 'EX', ttlSeconds);
  },

  async delete(key: string): Promise<void> {
    if (!redisClient) return;
    await redisClient.del(key);
  }
};