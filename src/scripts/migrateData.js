const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envConfig = require('dotenv').config({ path: envPath });
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-rev';

async function migrate() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // --- 1. Migrate Folders ---
  console.log('\n--- Migrating Folders ---');
  const folders = await db.collection('folders').find({}).toArray();
  console.log(`Found ${folders.length} folders.`);

  for (const folder of folders) {
    console.log(`Migrating folder: "${folder.title}" (${folder._id})`);
    
    // Find all revision cards belonging to this folder, sorted by order, then createdAt
    const cards = await db.collection('revisioncards')
      .find({ folderId: folder._id })
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    const cardIds = cards.map(c => c._id);
    console.log(`-> Found ${cardIds.length} cards in folder.`);

    await db.collection('folders').updateOne(
      { _id: folder._id },
      { $set: { cardIds: cardIds } }
    );
    console.log(`-> Folder "${folder.title}" updated successfully.`);
  }

  // --- 2. Migrate Playlists ---
  console.log('\n--- Migrating Playlists ---');
  const playlists = await db.collection('playlists').find({}).toArray();
  console.log(`Found ${playlists.length} playlists.`);

  for (const playlist of playlists) {
    console.log(`Migrating playlist: "${playlist.name || playlist.title}" (${playlist._id})`);

    let finalCardIds = [];

    // Check if the playlist already has orderedCardIds field
    if (playlist.orderedCardIds && playlist.orderedCardIds.length > 0) {
      console.log(`-> Found ${playlist.orderedCardIds.length} cards in orderedCardIds field.`);
      finalCardIds = playlist.orderedCardIds;
    } else {
      // Fetch playlist items from playlistitems collection
      const items = await db.collection('playlistitems')
        .find({ playlistId: playlist._id })
        .sort({ addedAt: 1 })
        .toArray();

      finalCardIds = items
        .map(item => item.revisionCardId || item.placardId)
        .filter(Boolean);
      console.log(`-> Found ${finalCardIds.length} cards in playlistitems collection.`);
    }

    await db.collection('playlists').updateOne(
      { _id: playlist._id },
      { 
        $set: { cardIds: finalCardIds },
        $unset: { orderedCardIds: "" } // Clean up deprecated field
      }
    );
    console.log(`-> Playlist "${playlist.name || playlist.title}" updated successfully.`);
  }

  console.log('\nMigration complete! Closing database connection...');
  await mongoose.disconnect();
  console.log('Database connection closed.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
