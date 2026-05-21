import mongoose, { Document, Schema } from 'mongoose';

export interface IWalkthroughStep {
  stepNumber: number;
  title: string;
  explanation: string;
  code?: string;
  insight?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface IMcq {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface IPlacard extends Document {
  domainId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  order: number;
  estimatedTime: number; // in minutes
  companiesAsked: string[];
  
  // Core Content
  question: string;
  hints: string[];
  mcqs: IMcq[];
  walkthrough: IWalkthroughStep[];
  
  // Mastery
  revisionSummary?: string;
  commonMistakes?: string[];
  relatedPatterns?: string[];
  
  // Future Scalability (AI, Video, Adaptive)
  aiHints?: string[];
  videoWalkthroughUrl?: string;
  adaptiveLearningMeta?: Record<string, any>;
  
  isPublished: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WalkthroughStepSchema = new Schema<IWalkthroughStep>({
  stepNumber: { type: Number, required: true },
  title: { type: String, required: true },
  explanation: { type: String, required: true },
  code: { type: String },
  insight: { type: String },
  timeComplexity: { type: String },
  spaceComplexity: { type: String },
});

const McqSchema = new Schema<IMcq>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String },
});

const PlacardSchema = new Schema<IPlacard>(
  {
    domainId: { type: Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [{ type: String, index: true }],
    order: { type: Number, default: 0 },
    estimatedTime: { type: Number, default: 15 },
    companiesAsked: [{ type: String }],
    question: { type: String, required: true },
    hints: [{ type: String }],
    mcqs: [McqSchema],
    walkthrough: [WalkthroughStepSchema],
    revisionSummary: { type: String },
    commonMistakes: [{ type: String }],
    relatedPatterns: [{ type: String }],
    aiHints: [{ type: String }],
    videoWalkthroughUrl: { type: String },
    adaptiveLearningMeta: { type: Schema.Types.Mixed, default: {} },
    isPublished: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPlacard>('Placard', PlacardSchema);