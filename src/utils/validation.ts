import mongoose from 'mongoose';

/**
 * Validates if a given value is a valid sync identifier.
 * Matches standard 24-character hexadecimal MongoDB ObjectIds OR 36-character RFC4122 UUID strings.
 */
export const isValidId = (id: any): boolean => {
  if (typeof id !== 'string' && !(id instanceof mongoose.Types.ObjectId)) {
    return false;
  }
  const idStr = id.toString();
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return objectIdRegex.test(idStr) || uuidRegex.test(idStr);
};
