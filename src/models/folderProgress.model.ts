import mongoose, { Document, Schema, Types, model } from 'mongoose';

export interface IFolderProgress extends Document {
  userId: Types.ObjectId;
  folderId: string;
  completedLoops: number;
  lastCompletedAt?: Date;
  totalCardsViewed: number;
  seenCount: number;
  totalCount: number;
  resumeCardId?: string;
  lastCardId?: string;
  resumeIndex?: number;
  lastIndex?: number;
  resumeScrollOffset?: number;
  resumeTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FolderProgressSchema = new Schema<IFolderProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    folderId: {
      type: String,
      ref: 'Folder',
      required: true,
      index: true,
    },
    completedLoops: { type: Number, default: 0 },
    lastCompletedAt: { type: Date },
    totalCardsViewed: { type: Number, default: 0 },
    seenCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    resumeCardId: { type: String, ref: 'RevisionCard' },
    lastCardId: { type: String, ref: 'RevisionCard' },
    resumeIndex: { type: Number },
    lastIndex: { type: Number },
    resumeScrollOffset: { type: Number },
    resumeTimestamp: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

// Compound index for fast lookup of a user's progress for a specific folder
FolderProgressSchema.index({ userId: 1, folderId: 1 }, { unique: true });

// Pre-save hook to keep lastCardId/lastIndex in sync with resumeCardId/resumeIndex
FolderProgressSchema.pre('save', function (next) {
  if (this.lastCardId && !this.resumeCardId) {
    this.resumeCardId = this.lastCardId;
  } else if (this.resumeCardId && !this.lastCardId) {
    this.lastCardId = this.resumeCardId;
  }
  if (this.lastIndex !== undefined && this.resumeIndex === undefined) {
    this.resumeIndex = this.lastIndex;
  } else if (this.resumeIndex !== undefined && this.lastIndex === undefined) {
    this.lastIndex = this.resumeIndex;
  }
  next();
});

const FolderProgress = model<IFolderProgress>('FolderProgress', FolderProgressSchema);
export default FolderProgress;
