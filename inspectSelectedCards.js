require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  const cards = await db.collection('revisioncards').find({ 
    title: { $in: ["Set Matrix Zeroes", "Pascal's Triangle", "Pascal’s Triangle"] } 
  }).toArray();
  
  console.log(`Found ${cards.length} cards.`);
  for (const c of cards) {
    console.log(`=============================================`);
    console.log(`Card ID: ${c._id}`);
    console.log(`Title: "${c.title}"`);
    console.log(`Explanation: "${c.explanation}"`);
    console.log(`Slides Count: ${c.slides ? c.slides.length : 0}`);
    if (c.slides) {
      c.slides.forEach((s, i) => {
        console.log(`  Slide [${i}]: type="${s.type}" | headline="${s.headline}"`);
        console.log(`    body: "${s.body ? s.body.substring(0, 120).replace(/\n/g, ' ') : 'N/A'}"`);
      });
    }
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
