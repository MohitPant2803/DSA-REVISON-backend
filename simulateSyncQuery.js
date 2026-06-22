require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;

  console.log('\nFinding user "mohi13245@gmail.com"...');
  const user = await db.collection('users').findOne({ email: 'mohi13245@gmail.com' });
  
  if (!user) {
    console.error('❌ User not found!');
    await mongoose.disconnect();
    return;
  }

  const userId = user._id;
  console.log(`👤 Found User: "${user.name}" | Email: "${user.email}" | MongoDB ID: ${userId}`);

  // Simulate getClientPlaylistsForSyncService
  console.log('\n--- SIMULATING getClientPlaylistsForSyncService ---');
  const customPlaylists = await db.collection('playlists').find({ userId, kind: { $ne: 'system' } }).toArray();
  console.log(`Matched playlists count: ${customPlaylists.length}`);
  for (const pl of customPlaylists) {
    console.log(`- "${pl.name}" | ID: ${pl._id} | kind: ${pl.kind}`);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
