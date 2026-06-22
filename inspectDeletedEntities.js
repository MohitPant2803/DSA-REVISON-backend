require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;

  console.log('\nFinding user "mohit.pant1828@gmail.com"...');
  const user = await db.collection('users').findOne({ email: 'mohit.pant1828@gmail.com' });
  
  if (!user) {
    console.error('❌ User not found!');
    await mongoose.disconnect();
    return;
  }

  const userId = user._id;
  console.log(`👤 Found User: "${user.name}" | Email: "${user.email}" | MongoDB ID: ${userId}`);

  console.log('\n--- DELETED ENTITIES IN MONGODB FOR THIS USER ---');
  const deleted = await db.collection('deletedentities').find({ userId: userId }).toArray();
  console.log(`Total deleted entities: ${deleted.length}`);
  
  for (const del of deleted) {
    console.log(`- EntityId: ${del.entityId} | EntityType: ${del.entityType} | DeletedAt: ${del.deletedAt}`);
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
