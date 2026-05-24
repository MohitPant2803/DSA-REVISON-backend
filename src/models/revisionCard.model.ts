import mongoose, { Document, Schema, Types, model } from 'mongoose';

export type CardVisibility = 'public' | 'private';

export type Complexity = string;

export interface ISlide {
  type?: string;
  headline: string;
  body?: string;
  code?: string;
  blocks?: Array<any>;
}

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
  slides?: ISlide[];
  isDeleted?: boolean;
  deletedAt?: Date;
  rootFolderId?: Types.ObjectId;
  rootFolderName?: string;
  subfolderPath?: string;
  subfolderIds?: Types.ObjectId[];
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
    slides: {
      type: [
        {
          type: { type: String },
          headline: { type: String, required: true },
          body: { type: String },
          code: { type: String },
          blocks: { type: [Schema.Types.Mixed], default: [] },
        },
      ],
      default: undefined,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    rootFolderId: { type: Schema.Types.ObjectId, ref: 'Folder', index: true },
    rootFolderName: { type: String, trim: true },
    subfolderPath: { type: String, trim: true },
    subfolderIds: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
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
RevisionCardSchema.index({ rootFolderId: 1, isDeleted: 1 });
RevisionCardSchema.index({ isDeleted: 1, updatedAt: -1 });
RevisionCardSchema.index({ title: 'text', topic: 'text', explanation: 'text' });

const RevisionCard = model<IRevisionCard>('RevisionCard', RevisionCardSchema);
export default RevisionCard;
