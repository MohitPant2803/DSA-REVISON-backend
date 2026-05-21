import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

/**
 * Middleware to validate request data (body, query, params) against a Zod schema.
 * If validation fails, it passes a 400 Bad Request error to the next error handler.
 *
 * @param schema The Zod schema to validate against.
 * @returns An Express middleware function.
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((issue) => issue.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
      return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An internal error occurred during validation.'));
    }
  };