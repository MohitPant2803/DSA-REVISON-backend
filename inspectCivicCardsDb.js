require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;

  console.log('Fetching cards under Civic Utilities and Sports...');
  const cards = await db.collection('revisioncards').find({
    subfolderPath: /Civic Utilities and Sports/i
  }).toArray();
  
  console.log(`Found ${cards.length} cards in MongoDB:`);
  cards.forEach(c => {
    console.log(`- Title: ${c.title}`);
    console.log(`  ID: ${c._id}`);
    console.log(`  subfolderPath: ${c.subfolderPath}`);
    if (c.slides) {
      console.log(`  Slides: ${c.slides.length}`);
      c.slides.forEach((s, idx) => {
        console.log(`    Slide ${idx + 1} (${s.type}): ${s.headline}`);
        console.log(`      Body: ${s.body}`);
      });
    }
    console.log('--------------------------------------------------');
  });

  await mongoose.disconnect();
}

run().catch(console.error);
