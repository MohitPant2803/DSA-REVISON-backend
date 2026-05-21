import { env } from '../config/env';

const formatMessage = (level: string, message: string) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
};

export const logger = {
  info: (message: string, ...meta: any[]) => {
    console.log(formatMessage('info', message), ...meta);
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(formatMessage('warn', message), ...meta);
  },
  error: (message: string, error?: any) => {
    console.error(formatMessage('error', message));
    if (error) {
      const errorDetails = env.isDev ? error : error.message;
      console.error(errorDetails);
    }
  },
};