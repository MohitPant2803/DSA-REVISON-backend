const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  const cards = await db.collection('revisioncards').find({ isDeleted: { $ne: true } }).toArray();
  console.log(`Total active cards in DB: ${cards.length}`);
  
  const titles = cards.map(c => c.title);
  console.log('All Card Titles:');
  console.log(JSON.stringify(titles, null, 2));
  
  await mongoose.disconnect();
}

run().catch(console.error);
