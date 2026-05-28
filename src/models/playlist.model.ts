import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  title?: string;
  description?: string;
  color1?: string;
  color2?: string;
  itemCount: number;
  completedLoops: number;
  lastCompletedAt?: Date;
  totalCardsViewed: number;
  resumeCardId?: mongoose.Types.ObjectId;
  resumeIndex?: number;
  lastPlayedIndex?: number;
  resumeScrollOffset?: number;
  resumeTimestamp?: Date;
  cardIds?: mongoose.Types.ObjectId[];
  customOrderUpdatedAt?: Date;
  revision: number;
  lastModifiedLogicalSequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    color1: { type: String },
    color2: { type: String },
    itemCount: { type: Number, default: 0 },
    completedLoops: { type: Number, default: 0 },
    lastCompletedAt: { type: Date },
    totalCardsViewed: { type: Number, default: 0 },
    resumeCardId: { type: Schema.Types.ObjectId, ref: 'RevisionCard' },
    resumeIndex: { type: Number },
    lastPlayedIndex: { type: Number },
    resumeScrollOffset: { type: Number },
    resumeTimestamp: { type: Date },
    cardIds: [{ type: Schema.Types.ObjectId, ref: 'RevisionCard' }],
    customOrderUpdatedAt: { type: Date },
    revision: { type: Number, default: 0, index: true },
    lastModifiedLogicalSequence: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to keep name and title in sync
PlaylistSchema.pre('save', function (next) {
  if (this.title && !this.name) {
    this.name = this.title;
  } else if (this.name && !this.title) {
    this.title = this.name;
  }

  if (this.cardIds?.length) {
    const seen = new Set<string>();
    this.cardIds = this.cardIds.filter((id) => {
      const key = id.toString();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    this.itemCount = this.cardIds.length;
  } else {
    this.itemCount = 0;
  }

  next();
});

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
