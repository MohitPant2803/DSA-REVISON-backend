require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  const folder = await db.collection('folders').findOne({ title: "Arrays & Matrix" });
  if (!folder) {
    console.log('Folder not found');
    await mongoose.disconnect();
    return;
  }
  
  console.log(`Folder: "${folder.title}" | ID: ${folder._id}`);
  const cards = await db.collection('revisioncards').find({ 
    folderId: folder._id,
    isDeleted: { $ne: true }
  }).toArray();
  
  console.log(`Found ${cards.length} cards:`);
  cards.forEach(c => {
    console.log(`- Card Title: "${c.title}" | ID: ${c._id}`);
    console.log(`  Explanation: "${c.explanation ? c.explanation.substring(0, 100).replace(/\n/g, ' ') : 'N/A'}"`);
    if (c.slides && c.slides.length > 0) {
      console.log(`  First Slide Headline: "${c.slides[0].headline}"`);
      console.log(`  First Slide Body: "${c.slides[0].body ? c.slides[0].body.substring(0, 100).replace(/\n/g, ' ') : 'N/A'}"`);
    }
    console.log('----------------------------------------------------');
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
