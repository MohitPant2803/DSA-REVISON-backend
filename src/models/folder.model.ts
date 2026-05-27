import mongoose, { Document, Schema, Types, model } from 'mongoose';

export type FolderVisibility = 'public' | 'private';
export type RoleAccess = 'user' | 'admin' | 'superadmin';

export interface IFolder extends Document {
  title: string;
  description?: string;
  icon: string;
  color: string;
  createdBy: Types.ObjectId;
  visibility: FolderVisibility;
  roleAccess: RoleAccess[];
  order: number;
  parentFolderId?: Types.ObjectId | null;
  cardIds: Types.ObjectId[];
  revision: number;
  lastModifiedLogicalSequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: { type: String, trim: true },
    icon: { type: String, default: 'folder' },
    color: { type: String, default: '#7c3aed' },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    roleAccess: {
      type: [{ type: String, enum: ['user', 'admin', 'superadmin'] }],
      default: ['user', 'admin', 'superadmin'],
    },
    order: { type: Number, default: 0 },
    parentFolderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    cardIds: {
      type: [{ type: Schema.Types.ObjectId, ref: 'RevisionCard' }],
      default: [],
    },
    revision: { type: Number, default: 0, index: true },
    lastModifiedLogicalSequence: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

FolderSchema.index({ order: 1, createdAt: -1 });
FolderSchema.index({ parentFolderId: 1 });

const Folder = model<IFolder>('Folder', FolderSchema);
export default Folder;
