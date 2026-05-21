import mongoose, { Document, Schema } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  placardId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    placardId: { type: Schema.Types.ObjectId, ref: 'Placard', required: true },
  },
  {
    timestamps: true,
  }
);

// Enforce unique bookmarks per user + fast lookups
BookmarkSchema.index({ userId: 1, placardId: 1 }, { unique: true });
BookmarkSchema.index({ userId: 1, createdAt: -1 }); // Sorting by recently added

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);