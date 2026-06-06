import mongoose, { Document, Schema, Types, model } from 'mongoose';

export type FolderVisibility = 'public' | 'private';
export type RoleAccess = 'user' | 'admin' | 'superadmin';

export interface IFolder extends Document<string> {
  _id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  createdBy: Types.ObjectId;
  visibility: FolderVisibility;
  roleAccess: RoleAccess[];
  order: number;
  parentFolderId?: string | null;
  cardIds: string[];
  revision: number;
  lastModifiedLogicalSequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const FolderSchema = new Schema<IFolder>(
  {
    _id: { type: String, required: true },
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
      type: String,
      ref: 'Folder',
      default: null,
    },
    cardIds: {
      type: [{ type: String, ref: 'RevisionCard' }],
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
