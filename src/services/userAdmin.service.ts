import httpStatus from 'http-status';
import { Types } from 'mongoose';
import User, { IUser } from '../models/user.model';
import ApiError from '../utils/ApiError';

export const listUsers = async () => {
  return User.find().select('name email role profilePicture createdAt').sort({ createdAt: -1 }).lean();
};

export const updateUserRole = async (userId: string, role: IUser['role']) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user ID');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.role === 'superadmin' && role !== 'superadmin') {
    throw new ApiError(httpStatus.FORBIDDEN, 'Cannot demote a superadmin account');
  }

  user.role = role;
  await user.save();
  return user;
};
