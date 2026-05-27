import mongoose, { Schema, Document } from 'mongoose';

export interface IDeletedEntity extends Document {
  userId: mongoose.Types.ObjectId;
  entityId: string;
  entityType: 'folder' | 'playlist';
  revision: number;
  deletedAt: Date;
}

const DeletedEntitySchema = new Schema<IDeletedEntity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  entityId: { type: String, required: true },
  entityType: { type: String, required: true, enum: ['folder', 'playlist'] },
  revision: { type: Number, required: true, index: true },
  deletedAt: { type: Date, default: Date.now, index: true }
});

// Tombstone Compaction: Automatically purge deletions older than 30 days
DeletedEntitySchema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model<IDeletedEntity>('DeletedEntity', DeletedEntitySchema);
