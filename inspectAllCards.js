const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

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
