import mongoose, { Document, Schema, Types, model } from 'mongoose';

export type AttemptStatus = 'attempted' | 'skipped';
export type PerceivedDifficulty = 'easy' | 'medium' | 'hard' | null;

export interface IUserQuestionProgress extends Document {
  userId: Types.ObjectId;
  questionId: Types.ObjectId; // References RevisionCard
  attemptStatus: AttemptStatus;
  perceivedDifficultyByUser: PerceivedDifficulty;
  createdAt: Date;
  updatedAt: Date;
}

const UserQuestionProgressSchema = new Schema<IUserQuestionProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'RevisionCard',
      required: [true, 'Question ID is required'],
      index: true,
    },
    attemptStatus: {
      type: String,
      enum: ['attempted', 'skipped'],
      required: [true, 'Attempt status is required'],
    },
    perceivedDifficultyByUser: {
      type: String,
      enum: ['easy', 'medium', 'hard', null],
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Strict required compound indexes for high performance scaling
UserQuestionProgressSchema.index({ userId: 1, questionId: 1 }, { unique: true });
UserQuestionProgressSchema.index({ userId: 1, perceivedDifficultyByUser: 1 });
UserQuestionProgressSchema.index({ userId: 1, attemptStatus: 1 });

const UserQuestionProgress = model<IUserQuestionProgress>('UserQuestionProgress', UserQuestionProgressSchema);
export default UserQuestionProgress;
