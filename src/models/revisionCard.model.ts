import mongoose, { Document, Schema, Types, model } from 'mongoose';

export type CardVisibility = 'public' | 'private';

export const COMPLEXITY_LEVELS = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(n³)',
  'O(2^n)',
] as const;

export type Complexity = (typeof COMPLEXITY_LEVELS)[number];

export interface IRevisionCard extends Document {
  title: string;
  topic: string;
  explanation: string;
  code?: string;
  image?: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  complexity?: Complexity;
  examples: string[];
  folderId: Types.ObjectId;
  createdBy: Types.ObjectId;
  visibility: CardVisibility;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionCardSchema = new Schema<IRevisionCard>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
    },
    code: { type: String },
    image: { type: String },
    tags: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Difficulty is required'],
    },
    complexity: {
      type: String,
      enum: COMPLEXITY_LEVELS,
    },
    examples: { type: [String], default: [] },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      required: [true, 'Folder is required'],
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

RevisionCardSchema.index({ topic: 1, difficulty: 1 });
RevisionCardSchema.index({ tags: 1 });
RevisionCardSchema.index({ createdBy: 1 });
RevisionCardSchema.index({ folderId: 1, order: 1 });
RevisionCardSchema.index({ title: 'text', topic: 'text', explanation: 'text' });

const RevisionCard = model<IRevisionCard>('RevisionCard', RevisionCardSchema);
export default RevisionCard;
