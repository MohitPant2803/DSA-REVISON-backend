const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;
  
  console.log('--- REVISION CARDS ---');
  const card = await db.collection('revisioncards').findOne({});
  console.log('Single Card from DB:', JSON.stringify(card, null, 2));
  
  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
