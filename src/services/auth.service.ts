import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';
import User, { IUser } from '../models/user.model';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const SUPERADMIN_EMAIL =
  env.SUPERADMIN_EMAIL?.toLowerCase() ?? 'mohit.pant@1828@gmail.com'.toLowerCase();

const resolveRole = (email: string): IUser['role'] => {
  if (email.toLowerCase() === SUPERADMIN_EMAIL) return 'superadmin';
  return 'user';
};

export const verifyGoogleTokenAndLogin = async (idToken: string): Promise<IUser> => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured on the server');
  }

  const audiences = [env.GOOGLE_CLIENT_ID, env.GOOGLE_ANDROID_CLIENT_ID].filter(Boolean) as string[];

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken,
      audience: audiences.length === 1 ? audiences[0] : audiences,
    });
  } catch (err: any) {
    console.error('[Google Auth Error] Verification failed:', err);
    throw new Error(`Google token verification failed: ${err.message}. Allowed audiences: ${audiences.join(', ')}`);
  }

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Invalid Google token payload: payload or email is missing');
  }

  const { sub: googleId, email, name, picture: profilePicture } = payload;

  // 1. Check if user already exists in MongoDB by email
  let user = await User.findOne({ email });

  if (user) {
    console.log(`[Auth] Existing user found. Opening registered account: ${email}`);
    return user;
  }

  // 2. If user doesn't exist, create a new User ID and document
  console.log(`[Auth] No existing user found. Creating new MongoDB document for: ${email}`);
  const assignedRole = resolveRole(email);
  if (assignedRole === 'superadmin') {
    console.log(`[Auth] Role assignment: New user ${email} detected as superadmin.`);
  }

  return User.create({
    googleId,
    email,
    name,
    profilePicture,
    role: assignedRole,
    authProvider: 'google',
  });
};