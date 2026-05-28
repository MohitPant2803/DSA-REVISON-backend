const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  const cards = await db.collection('revisioncards').find({
    isDeleted: { $ne: true }
  }).limit(10).toArray();
  
  console.log(`Checking first ${cards.length} cards:`);
  cards.forEach(c => {
    console.log(`-----------------------------------------------`);
    console.log(`Title: "${c.title}"`);
    if (c.slides && c.slides.length > 0) {
      console.log(`First Slide:`);
      console.log(`  Type: "${c.slides[0].type}"`);
      console.log(`  Headline: "${c.slides[0].headline}"`);
      console.log(`  Body: "${c.slides[0].body}"`);
    } else {
      console.log(`No slides found.`);
    }
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
