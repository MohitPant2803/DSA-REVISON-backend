import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessedMutation extends Document {
  mutationId: string;
  userId: string;
  createdAt: Date;
}

const ProcessedMutationSchema: Schema = new Schema(
  {
    mutationId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }, // Automatically prune after 7 days
  },
  { timestamps: false }
);

export default mongoose.model<IProcessedMutation>('ProcessedMutation', ProcessedMutationSchema);
