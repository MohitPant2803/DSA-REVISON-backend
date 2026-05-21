import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  domainId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  type: string;
  description?: string;
  thumbnail?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  totalPlacards: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    domainId: { type: Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    estimatedHours: { type: Number, default: 0 },
    totalPlacards: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);