import mongoose, { Schema, Document } from 'mongoose';

export interface IUserCardState extends Document {
  userId: mongoose.Types.ObjectId;
  cardId: mongoose.Types.ObjectId;
  liked: boolean;
  watchLater: boolean;
  viewed: boolean;
  revisionCount: number;
  lastViewedAt?: Date;
}

const UserCardStateSchema = new Schema<IUserCardState>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  cardId: { type: Schema.Types.ObjectId, required: true, index: true },
  liked: { type: Boolean, default: false },
  watchLater: { type: Boolean, default: false },
  viewed: { type: Boolean, default: false },
  revisionCount: { type: Number, default: 0 },
  lastViewedAt: { type: Date, default: Date.now },
}, { timestamps: true });

UserCardStateSchema.index({ userId: 1, cardId: 1 }, { unique: true });

export default mongoose.model<IUserCardState>('UserCardState', UserCardStateSchema);
