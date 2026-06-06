import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document<string> {
  _id: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  title?: string;
  description?: string;
  color1?: string;
  color2?: string;
  kind: 'system' | 'custom';
  systemKey?: 'easy' | 'medium' | 'hard' | 'skipped';
  itemCount: number;
  completedLoops: number;
  lastCompletedAt?: Date;
  totalCardsViewed: number;
  resumeCardId?: string;
  resumeIndex?: number;
  lastPlayedIndex?: number;
  resumeScrollOffset?: number;
  resumeTimestamp?: Date;
  cardIds?: string[];
  customOrderUpdatedAt?: Date;
  revision: number;
  lastModifiedLogicalSequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    _id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    color1: { type: String },
    color2: { type: String },
    kind: { type: String, enum: ['system', 'custom'], default: 'custom', index: true },
    systemKey: { type: String, enum: ['easy', 'medium', 'hard', 'skipped'], sparse: true },
    itemCount: { type: Number, default: 0 },
    completedLoops: { type: Number, default: 0 },
    lastCompletedAt: { type: Date },
    totalCardsViewed: { type: Number, default: 0 },
    resumeCardId: { type: String, ref: 'RevisionCard' },
    resumeIndex: { type: Number },
    lastPlayedIndex: { type: Number },
    resumeScrollOffset: { type: Number },
    resumeTimestamp: { type: Date },
    cardIds: [{ type: String, ref: 'RevisionCard' }],
    customOrderUpdatedAt: { type: Date },
    revision: { type: Number, default: 0, index: true },
    lastModifiedLogicalSequence: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

PlaylistSchema.index(
  { userId: 1, systemKey: 1 },
  { unique: true, partialFilterExpression: { kind: 'system', systemKey: { $exists: true } } }
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
