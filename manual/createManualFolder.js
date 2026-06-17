require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

// Define Folder Schema matching database structure
const FolderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, default: 'folder' },
    color: { type: String, default: '#7c3aed' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    roleAccess: { type: [String], default: ['user', 'admin', 'superadmin'] },
    order: { type: Number, default: 0 },
    parentFolderId: { type: String, default: null },
    cardIds: { type: [String], default: [] },
    revision: { type: Number, default: 0 }
  },
  { timestamps: true, versionKey: false }
);

const Folder = mongoose.models.Folder || mongoose.model('Folder', FolderSchema);

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from your .env file!');
  }
  
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  // Fetch the system admin user ID
  const adminUser = await mongoose.connection.db.collection('users').findOne({ email: 'system@admin.com' });
  if (!adminUser) {
    throw new Error('System admin user not found. Please run npm run seed:dsa first.');
  }

  // Define new manual folder: node manual/createManualFolder.js
  const folderData = {
    _id: crypto.randomUUID(), // Generates standard UUIDv4 string
    title: "String", // Folder Title 
    description: "",
    icon: "brain", // Icons available: "folder" (Default), "layers", "graphs", "dp", "database", "book", "code", "brain"
    color: "#ec4848",
    createdBy: adminUser._id,
    visibility: "public",
    order: 1,
    parentFolderId: "82cc43df-5c04-45a5-a0d3-742fcc3e7a6d",
  };

  // Insert and save
  const newFolder = new Folder(folderData);
  await newFolder.save();

  console.log(`\n✅ Folder Created Successfully!`);
  console.log(`- Title: "${newFolder.title}"`);
  console.log(`- UUID: ${newFolder._id}`);
  console.log(`- parentFolderId: ${newFolder.parentFolderId}`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
