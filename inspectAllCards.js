require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  const cards = await db.collection('revisioncards').find({ isDeleted: { $ne: true } }).toArray();
  console.log(`Total active cards: ${cards.length}`);
  cards.forEach(c => {
    console.log(`- Card Title: "${c.title}"`);
    console.log(`  ID: ${c._id}`);
    console.log(`  Folder: "${c.subfolderPath}"`);
    console.log(`  Explanation: ${c.explanation ? c.explanation.substring(0, 100).replace(/\n/g, ' ') : 'N/A'}...`);
    console.log('----------------------------------------------------');
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
