import mongoose, { Document, Schema } from 'mongoose';

export interface IDomain extends Document {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  gradient?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DomainSchema = new Schema<IDomain>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    icon: { type: String },
    gradient: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDomain>('Domain', DomainSchema);