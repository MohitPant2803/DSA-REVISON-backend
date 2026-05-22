import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylistItem extends Document {
  playlistId: mongoose.Types.ObjectId;
  placardId?: mongoose.Types.ObjectId;
  revisionCardId?: mongoose.Types.ObjectId;
  addedAt: Date;
}

const PlaylistItemSchema = new Schema<IPlaylistItem>(
  {
    playlistId: { type: Schema.Types.ObjectId, ref: 'Playlist', required: true },
    placardId: { type: Schema.Types.ObjectId, ref: 'Placard' },
    revisionCardId: { type: Schema.Types.ObjectId, ref: 'RevisionCard' },
    addedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

PlaylistItemSchema.pre('validate', function (next) {
  if (!this.placardId && !this.revisionCardId) {
    next(new Error('Either placardId or revisionCardId is required'));
  } else {
    next();
  }
});

PlaylistItemSchema.index({ playlistId: 1, placardId: 1 }, { unique: true, sparse: true });
PlaylistItemSchema.index({ playlistId: 1, revisionCardId: 1 }, { unique: true, sparse: true });
PlaylistItemSchema.index({ playlistId: 1, addedAt: -1 });

export default mongoose.model<IPlaylistItem>('PlaylistItem', PlaylistItemSchema);
