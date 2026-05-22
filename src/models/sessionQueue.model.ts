import mongoose, { Schema, Document } from 'mongoose';

export interface ISessionQueue extends Document {
  userId: mongoose.Types.ObjectId;
  sourceType: 'folder' | 'playlist' | 'liked' | 'watchLater';
  sourceId: mongoose.Types.ObjectId;
  orderedCardIds: mongoose.Types.ObjectId[];
  currentIndex: number;
  shuffle: boolean;
  createdAt: Date;
}

const SessionQueueSchema = new Schema<ISessionQueue>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sourceType: { type: String, enum: ['folder', 'playlist', 'liked', 'watchLater'], required: true },
  sourceId: { type: Schema.Types.ObjectId, required: true, index: true },
  orderedCardIds: [{ type: Schema.Types.ObjectId, ref: 'RevisionCard' }],
  currentIndex: { type: Number, default: 0 },
  shuffle: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

export default mongoose.model<ISessionQueue>('SessionQueue', SessionQueueSchema);
