require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;
  
  const totalCards = await db.collection('revisioncards').countDocuments({});
  const cardsWithSlides = await db.collection('revisioncards').countDocuments({ slides: { $exists: true, $not: { $size: 0 } } });
  const cardsWithSingleSlide = await db.collection('revisioncards').countDocuments({ slides: { $size: 1 } });
  const cardsWithoutSlides = await db.collection('revisioncards').countDocuments({ $or: [ { slides: { $exists: false } }, { slides: { $size: 0 } } ] });
  
  console.log(`Total revision cards in database: ${totalCards}`);
  console.log(`Cards with full slides array: ${cardsWithSlides}`);
  console.log(`Cards with only a single cover slide (needs expansion): ${cardsWithSingleSlide}`);
  console.log(`Cards completely lacking slides: ${cardsWithoutSlides}`);
  
  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
