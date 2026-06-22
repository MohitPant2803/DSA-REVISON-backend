require('dotenv').config();
const mongoose = require('mongoose');

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

  const userId = user._id;
  console.log(`👤 User ID (ObjectId): ${userId}`);

  // Querying using standard find with { userId, kind: { $ne: 'system' } }
  console.log('\n--- QUERYING { userId, kind: { $ne: \'system\' } } ---');
  const playlists = await db.collection('playlists').find({ userId, kind: { $ne: 'system' } }).toArray();
  console.log(`Matched playlists count: ${playlists.length}`);
  
  playlists.forEach(pl => {
    console.log(`\nPlaylist: "${pl.name}"`);
    console.log(`- ID: ${pl._id}`);
    console.log(`- kind: ${pl.kind}`);
    console.log(`- cardIds:`, pl.cardIds);
  });

  // Querying using string userId just in case
  console.log('\n--- QUERYING WITH STRING USERID ---');
  const playlistsStr = await db.collection('playlists').find({ userId: userId.toString(), kind: { $ne: 'system' } }).toArray();
  console.log(`Matched playlists (string userId) count: ${playlistsStr.length}`);

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
