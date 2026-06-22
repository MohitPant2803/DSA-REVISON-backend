require('dotenv').config();
const mongoose = require('mongoose');
const { updateSessionIndex } = require('./src/services/reelsFeedService');

const mongoUri = process.env.MONGO_URI;

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
