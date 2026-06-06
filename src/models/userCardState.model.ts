import mongoose, { Schema, Document } from 'mongoose';

export interface IUserCardState extends Document {
  userId: mongoose.Types.ObjectId;
  cardId: string;
  liked: boolean;
  watchLater: boolean;
  viewed: boolean;
  viewCount: number;
  completed: boolean;
  masteryScore: number;
  revisionCount: number;
  lastViewedAt?: Date;
}

const UserCardStateSchema = new Schema<IUserCardState>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cardId: { type: String, required: true, index: true },
  liked: { type: Boolean, default: false },
  watchLater: { type: Boolean, default: false },
  viewed: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  masteryScore: { type: Number, default: 0 },
  revisionCount: { type: Number, default: 0 },
  lastViewedAt: { type: Date, default: Date.now },
}, { timestamps: true });

UserCardStateSchema.index({ userId: 1, cardId: 1 }, { unique: true });

export default mongoose.model<IUserCardState>('UserCardState', UserCardStateSchema);
