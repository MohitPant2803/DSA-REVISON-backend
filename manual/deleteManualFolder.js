require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from your .env file!');
  }

  // Define the target folder ID we want to delete
  const targetFolderId = "4b9341e1-1e8d-49c0-84ef-947ffab8963f"; // The "System Design Patterns" folder

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Verify the folder exists
  const folder = await db.collection('folders').findOne({ _id: targetFolderId });
  if (!folder) {
    console.log(`⚠️ Folder with ID "${targetFolderId}" not found. It may already be deleted.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Found folder: "${folder.title}". Proceeding with deletion...`);

  // 2. Delete the Folder document from MongoDB
  const folderDeleteResult = await db.collection('folders').deleteOne({ _id: targetFolderId });
  console.log(`- Folder document deleted from 'folders' collection (Count: ${folderDeleteResult.deletedCount})`);

  // 3. Delete any Revision Cards associated with this folder
  const cardDeleteResult = await db.collection('revisioncards').deleteMany({ folderId: targetFolderId });
  console.log(`- Associated cards deleted from 'revisioncards' collection (Count: ${cardDeleteResult.deletedCount})`);

  // 4. Create Deletion Tombstones (DeletedEntity) for ALL users
  // This is CRITICAL so that client devices delete the folder locally on sync!
  console.log('Creating tombstones for all users to sync deletion...');
  const users = await db.collection('users').find({}).toArray();
  let tombstoneCount = 0;

  for (const user of users) {
    // Increment the user's revision sequence so they trigger a sync sweep
    const nextRevision = (user.currentRevision || 0) + 1;
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { currentRevision: nextRevision } }
    );

    // Insert DeletedEntity tombstone
    await db.collection('deletedentities').findOneAndUpdate(
      { userId: user._id, entityId: targetFolderId, entityType: 'folder' },
      { 
        $set: { 
          userId: user._id, 
          entityId: targetFolderId, 
          entityType: 'folder', 
          revision: nextRevision, 
          deletedAt: new Date() 
        } 
      },
      { upsert: true }
    );
    tombstoneCount++;
  }

  console.log(`- Created ${tombstoneCount} DeletedEntity tombstones in database.`);
  console.log(`\n✅ Folder "${folder.title}" permanently deleted and prepared for sync!`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
