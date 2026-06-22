require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  const cards = await db.collection('revisioncards').find({
    isDeleted: { $ne: true }
  }).toArray();
  
  const seeded = cards.filter(c => c.slides && c.slides.length > 1);
  console.log(`Total seeded cards with custom slides: ${seeded.length}`);
  seeded.forEach(c => {
    console.log(`- Title: "${c.title}" | ID: ${c._id}`);
    if (c.slides && c.slides.length > 0) {
      console.log(`  Intro Slide Headline: "${c.slides[0].headline}"`);
    }
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
