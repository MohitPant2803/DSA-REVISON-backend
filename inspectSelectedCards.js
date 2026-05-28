const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

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
