import mongoose, { Document, Schema } from 'mongoose';

export interface ISeniorQuote extends Document {
  _id: mongoose.Types.ObjectId;
  text: string;
  author: string;
  collegeName: string;
  branch: string;
  yearOfGraduation: number;
  createdAt: Date;
  updatedAt: Date;
}

const SeniorQuoteSchema = new Schema<ISeniorQuote>(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
    collegeName: { type: String, required: true },
    branch: { type: String, required: true },
    yearOfGraduation: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISeniorQuote>('SeniorQuote', SeniorQuoteSchema);
