import User from '../models/user.model';
import mongoose from 'mongoose';

/**
 * Atomically increments the user's currentRevision counter.
 * Supports passing a Mongoose ClientSession for transaction-safe operations.
 */
export const getNextUserRevision = async (
  userId: string,
  session?: mongoose.ClientSession
): Promise<number> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { currentRevision: 1 } },
    { new: true, upsert: true, session }
  );
  return user.currentRevision;
};
