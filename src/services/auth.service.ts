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

  // Verification handles audience and expiration checks inherently
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Invalid Google token payload');
  }

  const { sub: googleId, email, name, picture: profilePicture } = payload;

  let user = await User.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
    }
    const assignedRole = resolveRole(email);
    if (assignedRole === 'superadmin' && user.role !== 'superadmin') {
      user.role = 'superadmin';
    }
    await user.save();
    return user;
  }

  return User.create({
    googleId,
    email,
    name,
    profilePicture,
    role: resolveRole(email),
  });
};