require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from your .env file!');
  }

  // ==========================================
  // CONFIGURATION: Set card ID to delete  node manual/deleteManualCard.js
  // ==========================================
  const targetCardId = "aa131397-00f7-4746-85fa-65b6b1360846"; // The ID of the card you want to delete

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Verify the card exists
  const card = await db.collection('revisioncards').findOne({ _id: targetCardId });
  if (!card) {
    console.log(`⚠️ Card with ID "${targetCardId}" not found. It may already be deleted.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Found card: "${card.title}" (Topic: ${card.topic}). Proceeding with deletion...`);
  const folderId = card.folderId;

  // 2. Delete the card document from MongoDB
  const deleteResult = await db.collection('revisioncards').deleteOne({ _id: targetCardId });
  console.log(`- Card document deleted from 'revisioncards' collection (Count: ${deleteResult.deletedCount})`);

  // 3. Remove card ID from parent folder's cardIds list
  if (folderId) {
    const folder = await db.collection('folders').findOne({ _id: folderId });
    if (folder && folder.cardIds) {
      const updatedCardIds = folder.cardIds.filter(id => id !== targetCardId);
      await db.collection('folders').updateOne(
        { _id: folderId },
        { 
          $set: { 
            cardIds: updatedCardIds, 
            updatedAt: new Date() // Trigger folder re-sync
          } 
        }
      );
      console.log(`- Removed card ID from parent folder's cardIds list.`);
    }
  }

  // 4. Create Deletion Tombstones (DeletedEntity) for ALL users
  // This is CRITICAL so that client devices delete the card locally on sync!
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
      { userId: user._id, entityId: targetCardId, entityType: 'card' },
      { 
        $set: { 
          userId: user._id, 
          entityId: targetCardId, 
          entityType: 'card', 
          revision: nextRevision, 
          deletedAt: new Date() 
        } 
      },
      { upsert: true }
    );
    tombstoneCount++;
  }

  console.log(`- Created ${tombstoneCount} DeletedEntity tombstones in database.`);
  console.log(`\n✅ Card "${card.title}" permanently deleted and prepared for sync!`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
