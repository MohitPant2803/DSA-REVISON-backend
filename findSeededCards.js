const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

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
