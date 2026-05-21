import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylistItem extends Document {
  playlistId: mongoose.Types.ObjectId;
  placardId: mongoose.Types.ObjectId;
  addedAt: Date;
}

const PlaylistItemSchema = new Schema<IPlaylistItem>(
  {
    playlistId: { type: Schema.Types.ObjectId, ref: 'Playlist', required: true },
    placardId: { type: Schema.Types.ObjectId, ref: 'Placard', required: true },
    addedAt: { type: Date, default: Date.now },
  },
  {
    // Disable default timestamps, we only need addedAt
    timestamps: false,
  }
);

// Prevent duplicate items in the same playlist and optimize queries
PlaylistItemSchema.index({ playlistId: 1, placardId: 1 }, { unique: true });
PlaylistItemSchema.index({ playlistId: 1, addedAt: -1 });

export default mongoose.model<IPlaylistItem>('PlaylistItem', PlaylistItemSchema);