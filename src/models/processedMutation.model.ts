import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessedMutation extends Document {
  mutationId: string;
  userId: string;
  deviceId: string;
  translations?: Record<string, string>;
  createdAt: Date;
}

const ProcessedMutationSchema: Schema = new Schema(
  {
    mutationId: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    deviceId: { type: String, required: true, index: true },
    translations: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, expires: '30d' }, // Prune automatically after 30 days
  },
  { timestamps: false }
);

// Enforce atomic duplicate locks across user + device + mutation ID
ProcessedMutationSchema.index({ userId: 1, deviceId: 1, mutationId: 1 }, { unique: true });

export default mongoose.model<IProcessedMutation>('ProcessedMutation', ProcessedMutationSchema);
