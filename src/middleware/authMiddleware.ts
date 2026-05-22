import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { errorResponse } from '../utils/responseHandler';
import { verifyToken } from '../utils/jwt';
import User from '../models/user.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Client sends via Authorization Header (Mobile / standard REST)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Client sends via Cookies (Web Browsers / Next.js SSR)
  else if (req.headers.cookie) {
    const tokenCookie = req.headers.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized to access this route. Token missing.');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select('-__v');

    if (!user) {
      return errorResponse(res, 401, 'The user belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized, token validation failed.');
  }
});

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 403, `User role '${req.user?.role}' is not authorized to access this resource.`);
    }
    next();
  };
};

export const optionalProtect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Client sends via Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Client sends via Cookies
  else if (req.headers.cookie) {
    const tokenCookie = req.headers.cookie.split('; ').find(row => row.startsWith('token='));
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
    }
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-__v');
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore validation failures in optional protect
      console.warn('Optional auth token validation failed:', error);
    }
  }
  next();
});