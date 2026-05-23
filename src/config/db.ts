import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

// Configure Mongoose globally
mongoose.set('strictQuery', true);

mongoose.plugin((schema: mongoose.Schema) => {
  schema.set('timestamps', true);
});

/**
 * Cached connection for serverless environments (Vercel).
 * In serverless, each invocation may or may not reuse the same
 * runtime context. We cache the connection promise so that
 * concurrent requests during a cold start don't open multiple
 * connections, and warm invocations reuse the existing one.
 */
let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  // If we already have a ready connection, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return;
  }

  // If a connection attempt is already in flight, wait for it
  if (connectionPromise) {
    cachedConnection = await connectionPromise;
    return;
  }

  try {
    logger.info('Attempting to connect to MongoDB...');

    connectionPromise = mongoose.connect(env.MONGO_URI, {
      // Serverless-optimised Mongoose options
      bufferCommands: true,
      maxPoolSize: 5,          // keep pool small for serverless
      serverSelectionTimeoutMS: 15000,  // generous timeout for cold starts
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    });

    cachedConnection = await connectionPromise;
    logger.info(`MongoDB Connected: ${cachedConnection.connection.host}`);

    // Clean drop of legacy indexes to avoid compound index sparse duplicate bugs
    try {
      const db = cachedConnection.connection.db;
      if (db) {
        const collection = db.collection('playlistitems');
        const indexes = await collection.indexes();
        for (const idx of indexes) {
          if (idx.name === 'playlistId_1_placardId_1' && !idx.partialFilterExpression) {
            logger.info('Dropping legacy sparse index: playlistId_1_placardId_1');
            await collection.dropIndex('playlistId_1_placardId_1');
          }
          if (idx.name === 'playlistId_1_revisionCardId_1' && !idx.partialFilterExpression) {
            logger.info('Dropping legacy sparse index: playlistId_1_revisionCardId_1');
            await collection.dropIndex('playlistId_1_revisionCardId_1');
          }
        }
      }
    } catch (indexErr: any) {
      logger.info(`MongoDB Index repair info: ${indexErr.message}`);
    }
  } catch (error: any) {
    // Reset so the next invocation can retry
    connectionPromise = null;
    cachedConnection = null;
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    throw error; // let the caller handle it (don't process.exit in serverless!)
  }
};

// Handle MongoDB graceful shutdown (only fires on traditional long-running servers)
const gracefulDBShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Closing MongoDB connection...`);
  await mongoose.connection.close();
  cachedConnection = null;
  connectionPromise = null;
  logger.info('MongoDB connection closed gracefully.');
};

process.on('SIGINT', () => gracefulDBShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulDBShutdown('SIGTERM'));