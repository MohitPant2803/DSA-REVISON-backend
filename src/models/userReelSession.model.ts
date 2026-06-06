import mongoose, { Schema, Document } from 'mongoose';

export interface IUserReelSession extends Document {
  userId: mongoose.Types.ObjectId;
  queue: string[];
  currentIndex: number;
  deepestIndexReached: number;
  queueVersion: number;
  contentHash: string;
  isGenerating: boolean;
  eligibleCardCount: number;
  selectedFolderSnapshot: string[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserReelSessionSchema = new Schema<IUserReelSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    queue: [{ type: String, ref: 'RevisionCard' }],
    currentIndex: { type: Number, default: 0 },
    deepestIndexReached: { type: Number, default: 0 },
    queueVersion: { type: Number, default: 1 },
    contentHash: { type: String, default: '' },
    isGenerating: { type: Boolean, default: false },
    eligibleCardCount: { type: Number, default: 0 },
    selectedFolderSnapshot: [{ type: String, ref: 'Folder' }],
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
);

// High-performance MongoDB Indexes
UserReelSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL Index
UserReelSessionSchema.index({ updatedAt: -1 });

export default mongoose.model<IUserReelSession>('UserReelSession', UserReelSessionSchema);
