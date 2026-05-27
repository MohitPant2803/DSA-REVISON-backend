import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  placardId?: mongoose.Types.ObjectId;
  revisionCardId?: mongoose.Types.ObjectId;
  completed: boolean;
  revisionCount: number;
  mcqScore?: number; // e.g., 80 for 80%
  walkthroughCompleted: boolean;
  lastViewedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds

  // For future spaced repetition system
  nextRevisionAt?: Date;
  confidenceScore?: 'low' | 'medium' | 'high';
  favorite?: boolean;
  difficult?: boolean;
  archived?: boolean;
  playlists?: mongoose.Types.ObjectId[];
  difficultyState?: 'easy' | 'medium' | 'hard' | 'skipped' | null;
  stateChangedAt?: Date;
  revision: number;
  favoriteLogicalSequence: number;
  difficultyLogicalSequence: number;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    placardId: { type: Schema.Types.ObjectId, ref: 'Placard' },
    revisionCardId: { type: Schema.Types.ObjectId, ref: 'RevisionCard' },
    completed: { type: Boolean, default: false },
    revisionCount: { type: Number, default: 0 },
    mcqScore: { type: Number },
    walkthroughCompleted: { type: Boolean, default: false },
    lastViewedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    timeSpent: { type: Number, default: 0 }, // in seconds

    // Future-proofing fields
    nextRevisionAt: { type: Date },
    confidenceScore: { type: String, enum: ['low', 'medium', 'high'] },
    favorite: { type: Boolean, default: false },
    difficult: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
    difficultyState: { type: String, enum: ['easy', 'medium', 'hard', 'skipped', null], default: null },
    stateChangedAt: { type: Date },
    revision: { type: Number, default: 0, index: true },
    favoriteLogicalSequence: { type: Number, default: 0 },
    difficultyLogicalSequence: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ProgressSchema.index(
  { userId: 1, placardId: 1 }, 
  { unique: true, partialFilterExpression: { placardId: { $exists: true, $type: 'objectId' } } }
);
ProgressSchema.index(
  { userId: 1, revisionCardId: 1 }, 
  { unique: true, partialFilterExpression: { revisionCardId: { $exists: true, $type: 'objectId' } } }
);

// Index for fetching all of a user's progress, sorted by recent views
ProgressSchema.index({ userId: 1, lastViewedAt: -1 });

// Index for analytics on completed items
ProgressSchema.index({ userId: 1, completed: 1 });

export default mongoose.model<IProgress>('Progress', ProgressSchema);