const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

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

  console.log('\n--- FOCUS AREA CARD IDS ON USER DOCUMENT ---');
  console.log(`- focusEasyCardIds count: ${user.focusEasyCardIds?.length || 0}`);
  console.log(`- focusMediumCardIds count: ${user.focusMediumCardIds?.length || 0}`);
  console.log(`- focusHardCardIds count: ${user.focusHardCardIds?.length || 0}`);
  console.log(`- focusSkippedCardIds count: ${user.focusSkippedCardIds?.length || 0}`);

  console.log('\n--- PLAYLISTS OWNED BY THIS USER ---');
  const playlists = await db.collection('playlists').find({ userId: userId }).toArray();
  console.log(`Total playlists found: ${playlists.length}`);
  
  for (const pl of playlists) {
    console.log(`\nPlaylist: "${pl.name}" | ID: ${pl._id} | Kind: ${pl.kind} | SystemKey: ${pl.systemKey || 'none'}`);
    console.log(`- cardIds:`, pl.cardIds || []);
    console.log(`- orderedCardIds:`, pl.orderedCardIds || []);
    console.log(`- itemCount: ${pl.itemCount}`);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
