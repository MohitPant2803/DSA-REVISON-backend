import os from 'os';
import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { logger } from './utils/logger';

// Helper to get local network IPv4 address
const getLocalIpAddress = (): string => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    const addresses = interfaces[interfaceName];
    if (addresses) {
      for (const addr of addresses) {
        if (addr.family === 'IPv4' && !addr.internal) {
          return addr.address;
        }
      }
    }
  }
  return '127.0.0.1';
};

// Handle sync exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception! Shutting down...', err);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    const localIp = getLocalIpAddress();

    // Explicitly bind to 0.0.0.0 to accept connections from devices on the local network (e.g. your Expo app)
    const server = app.listen(Number(env.PORT), '0.0.0.0', () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`Local access ready: http://localhost:${env.PORT}`);
      logger.info(`Network access ready: http://${localIp}:${env.PORT}`);
    });

    // Handle unhandled async promise rejections
    process.on('unhandledRejection', (err: Error) => {
      logger.error('Unhandled Rejection! Shutting down...', err);
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
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();