import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: 'user' | 'admin' | 'superadmin';
  authProvider: string;
  streakCount: number;
  totalSwipes: number;
  totalScrolls: number;
  preferences: Record<string, any>;
  lastCompletedDate?: Date;
  currentDomain?: string;
  currentCategory?: string;
  currentRevision: number;
  lastDeviceId?: string;
  lastClockEpoch?: string;
  expoPushToken?: string;
  focusEasyCardIds?: string[];
  focusMediumCardIds?: string[];
  focusHardCardIds?: string[];
  focusSkippedCardIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    profilePicture: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    authProvider: {
      type: String,
      required: true,
      default: 'google'
    },
    streakCount: { type: Number, default: 0 },
    totalSwipes: { type: Number, default: 0 },
    totalScrolls: { type: Number, default: 0 },
    lastCompletedDate: { type: Date },
    preferences: { type: Schema.Types.Mixed, default: {} },
    currentDomain: { type: String },
    currentCategory: { type: String },
    currentRevision: { type: Number, default: 0, required: true },
    lastDeviceId: { type: String },
    lastClockEpoch: { type: String },
    expoPushToken: { type: String, default: null },
    focusEasyCardIds: [{ type: String, ref: 'RevisionCard' }],
    focusMediumCardIds: [{ type: String, ref: 'RevisionCard' }],
    focusHardCardIds: [{ type: String, ref: 'RevisionCard' }],
    focusSkippedCardIds: [{ type: String, ref: 'RevisionCard' }],
  },
  {
    // Timestamps are already set globally in db.ts, 
    // but explicitly defining them ensures typings match
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);