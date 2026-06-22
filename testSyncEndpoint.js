require('dotenv').config();
const mongoose = require('mongoose');
const { getClientPlaylistsForSyncService } = require('./src/services/playlist.service');
const Playlist = require('./src/models/playlist.model').default;

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  console.log('\nFinding user "mohit.pant1828@gmail.com"...');
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email: 'mohit.pant1828@gmail.com' });
  
  if (!user) {
    console.error('❌ User not found!');
    await mongoose.disconnect();
    return;
  }

  const userId = user._id.toString();
  console.log(`👤 User ID: ${userId}`);

  // Now query all custom playlists returned by getClientPlaylistsForSyncService
  console.log('\n--- EXECUTING getClientPlaylistsForSyncService ---');
  const playlists = await getClientPlaylistsForSyncService(userId);
  console.log(`Total playlists returned: ${playlists.length}`);
  
  playlists.forEach(pl => {
    console.log(`\nPlaylist: "${pl.name}"`);
    console.log(`- ID: ${pl._id} / id: ${pl.id}`);
    console.log(`- kind: ${pl.kind}`);
    console.log(`- systemKey: ${pl.systemKey}`);
    console.log(`- cardIds:`, pl.cardIds);
    console.log(`- orderedCardIds:`, pl.orderedCardIds);
  });

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
