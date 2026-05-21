import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

// Handle sync exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('❌ UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    // Explicitly bind to 0.0.0.0 to accept connections from devices on the local network (e.g. your Expo app)
    const server = app.listen(Number(env.PORT), '0.0.0.0', () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`📡 Network access ready: Point your frontend to http://10.93.36.159:${env.PORT}`);
    });

    // Handle unhandled async promise rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.error('❌ UNHANDLED REJECTION! Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Gracefully shut down HTTP server
    const shutdownServer = () => {
      server.close(() => logger.info('HTTP server closed.'));
    };

    process.on('SIGINT', shutdownServer);
    process.on('SIGTERM', shutdownServer);
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();