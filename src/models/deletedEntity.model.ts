import mongoose, { Schema, Document } from 'mongoose';

export interface IDeletedEntity extends Document {
  userId: mongoose.Types.ObjectId;
  entityId: string;
  entityType: 'folder' | 'playlist' | 'card';
  revision: number;
  deletedAt: Date;
}

const DeletedEntitySchema = new Schema<IDeletedEntity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  entityId: { type: String, required: true },
  entityType: { type: String, required: true, enum: ['folder', 'playlist', 'card'] },
  revision: { type: Number, required: true, index: true },
  deletedAt: { type: Date, default: Date.now, index: true }
});

DeletedEntitySchema.index({ userId: 1, entityId: 1, entityType: 1 }, { unique: true });

export default mongoose.model<IDeletedEntity>('DeletedEntity', DeletedEntitySchema);
