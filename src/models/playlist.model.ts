import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  color1?: string;
  color2?: string;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    color1: { type: String },
    color2: { type: String },
    itemCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPlaylist>('Playlist', PlaylistSchema);