require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

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
