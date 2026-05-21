import { Types } from 'mongoose';
import User from '../models/user.model';

export type UserRole = 'user' | 'admin' | 'superadmin';

/**
 * Determines if an actor can create/update/delete a resource owned by ownerId.
 * - superadmin: full override
 * - admin: own content + content owned by users (not other admins/superadmins)
 * - user: no write access (handled at route level)
 */
export async function canManageResource(
  actorId: Types.ObjectId,
  actorRole: UserRole,
  ownerId: Types.ObjectId
): Promise<boolean> {
  if (actorRole === 'superadmin') return true;
  if (actorId.equals(ownerId)) return true;

  if (actorRole === 'admin') {
    const owner = await User.findById(ownerId).select('role').lean();
    if (!owner) return false;
    return owner.role === 'user';
  }

  return false;
}

export function canReadResource(visibility: 'public' | 'private', actorRole?: UserRole): boolean {
  if (visibility === 'public') return true;
  return actorRole === 'admin' || actorRole === 'superadmin';
}
