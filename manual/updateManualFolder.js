require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from your .env file!');
  }

  // 1. Specify the UUID of the folder you want to update
  const targetFolderId = "42ded5b2-27a9-48dc-9d7b-4474114d1969"; // Replace with your folder's UUID

  // 2. Specify the new values you want to set: node manual/updateManualFolder.js
  const updateData = {
    title: "ABC2", // Set the new folder name
    description: "HEHEHHE2", // Set the new description
    icon: "layers", // Set the icon (optional)
    color: "#ea580c" // Set the color (optional)
  };

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 3. Find the folder
  const existingFolder = await db.collection('folders').findOne({ _id: targetFolderId });
  if (!existingFolder) {
    console.log(`⚠️ Folder with ID "${targetFolderId}" not found.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Current Folder Name: "${existingFolder.title}"`);
  console.log('Updating folder...');

  // 4. Update the folder document
  const result = await db.collection('folders').updateOne(
    { _id: targetFolderId },
    { 
      $set: { 
        ...updateData,
        updatedAt: new Date() // Bumps updatedAt so clients pull the updates
      } 
    }
  );

  console.log(`- Matched ${result.matchedCount} document.`);
  console.log(`- Modified ${result.modifiedCount} document.`);
  console.log(`\n✅ Folder updated successfully to: "${updateData.title}"`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
