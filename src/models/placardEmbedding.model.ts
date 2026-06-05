// LEGACY_DO_NOT_USE
import mongoose, { Document, Schema } from 'mongoose';

export interface IPlacardEmbedding extends Document {
  placardId: mongoose.Types.ObjectId;
  embedding: number[]; // e.g., 1536 dimensions for OpenAI text-embedding-3-small
  metadata: string; // Stringified context used to generate the embedding
  createdAt: Date;
  updatedAt: Date;
}

const PlacardEmbeddingSchema = new Schema<IPlacardEmbedding>({
  placardId: { type: Schema.Types.ObjectId, ref: 'Placard', required: true, index: true },
  embedding: { type: [Number], required: true },
  metadata: { type: String, required: true },
}, { timestamps: true });

/* 
  To support vector search in MongoDB Atlas, you will later create an Atlas Vector Search Index on the 'embedding' field:
  {
    "type": "vectorSearch",
    "fields": [{ "type": "vector", "path": "embedding", "numDimensions": 1536, "similarity": "cosine" }]
  }
*/

export default mongoose.model<IPlacardEmbedding>('PlacardEmbedding', PlacardEmbeddingSchema);