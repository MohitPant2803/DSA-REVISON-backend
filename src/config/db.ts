import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

// Configure Mongoose globally
mongoose.set('strictQuery', true);

mongoose.plugin((schema: mongoose.Schema) => {
  schema.set('timestamps', true);
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

export const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying connection in ${RETRY_DELAY / 1000}s... (Attempt ${retryCount + 1} of ${MAX_RETRIES})`);
      setTimeout(() => connectDB(retryCount + 1), RETRY_DELAY);
    } else {
      logger.error('❌ Max connection retries reached. Exiting application.');
      process.exit(1);
    }
  }
};

// Handle MongoDB graceful shutdown
const gracefulDBShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Closing MongoDB connection...`);
  await mongoose.connection.close();
  logger.info('MongoDB connection closed gracefully.');
};

process.on('SIGINT', () => gracefulDBShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulDBShutdown('SIGTERM'));