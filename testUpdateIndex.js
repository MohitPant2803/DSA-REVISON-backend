const mongoose = require('mongoose');
const { updateSessionIndex } = require('./src/services/reelsFeedService');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const userId = '6a173ff7c07aee9d9554ae4e';
  const newIndex = 5;

  try {
    console.log(`\nTesting updateSessionIndex for user ${userId} to index: ${newIndex}`);
    const result = await updateSessionIndex(userId, newIndex, Date.now());
    console.log('SUCCESS!');
    console.log(`currentIndex: ${result.currentIndex}`);
    console.log(`deepestIndexReached: ${result.deepestIndexReached}`);
  } catch (err) {
    console.error('ERROR OCCURRED during updateSessionIndex:');
    console.error(err);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
