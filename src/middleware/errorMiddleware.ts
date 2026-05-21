import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { errorResponse } from '../utils/responseHandler';
import { logger } from '../utils/logger';
import ApiError from '../utils/ApiError';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    return errorResponse(res, statusCode, message);
  }

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    return errorResponse(res, statusCode, message, err.errors);
  }

  const stack = env.NODE_ENV === 'production' ? null : err.stack;
  
  logger.error(`❌ [${req.method}] ${req.originalUrl} >> ${message}`, err);

  errorResponse(res, statusCode, message, stack ? { stack } : null);
};