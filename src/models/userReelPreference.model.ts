import mongoose, { Schema, Document } from 'mongoose';

export interface IUserReelPreference extends Document {
  userId: mongoose.Types.ObjectId;
  selectedRootFolderIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserReelPreferenceSchema = new Schema<IUserReelPreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    selectedRootFolderIds: [{ type: String, ref: 'Folder' }],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model<IUserReelPreference>('UserReelPreference', UserReelPreferenceSchema);
