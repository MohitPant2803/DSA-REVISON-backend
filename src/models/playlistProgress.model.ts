import mongoose, { Document, Schema, Types, model } from 'mongoose';

export interface IPlaylistProgress extends Document {
  userId: Types.ObjectId;
  playlistId: Types.ObjectId;
  lastCardId?: Types.ObjectId;
  lastIndex?: number;
  completedLoops: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistProgressSchema = new Schema<IPlaylistProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    playlistId: {
      type: Schema.Types.ObjectId,
      ref: 'Playlist',
      required: true,
      index: true,
    },
    lastCardId: { type: Schema.Types.ObjectId, ref: 'RevisionCard' },
    lastIndex: { type: Number, default: 0 },
    completedLoops: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

// Compound index for fast lookup of a user's progress for a specific playlist
PlaylistProgressSchema.index({ userId: 1, playlistId: 1 }, { unique: true });

const PlaylistProgress = model<IPlaylistProgress>('PlaylistProgress', PlaylistProgressSchema);
export default PlaylistProgress;
