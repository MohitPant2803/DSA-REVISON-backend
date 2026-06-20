require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const jwt = require('jsonwebtoken');

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;
  
  const user = await db.collection('users').findOne({ email: 'mohit.pant1828@gmail.com' });
  if (!user) {
    console.error('User not found!');
    await mongoose.disconnect();
    return;
  }
  
  console.log(`Generating token for ${user.email} (ID: ${user._id})`);
  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  console.log('Token generated. Querying live Vercel sync endpoint via https...');
  
  const options = {
    hostname: 'dsa-revison-backend.vercel.app',
    path: '/api/sync?sinceRevision=0',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Status code:', res.statusCode);
      try {
        const parsed = JSON.parse(data);
        const payload = parsed?.data;
        if (payload) {
          console.log('allowRemoteDestructiveSync returned:', payload.allowRemoteDestructiveSync);
          console.log('toRevision returned:', payload.toRevision);
          console.log('Tombstones returned count:', payload.delta?.deletedEntities?.length);
          const trialFolderDeletes = payload.delta?.deletedEntities?.filter(d => d.entityId === '78f25ebf-e82b-428c-afd9-06ba11a78248');
          console.log('Trial 2 Folder tombstones returned:', trialFolderDeletes);
        } else {
          console.log('No payload returned:', parsed);
        }
      } catch (err) {
        console.error('Failed to parse response:', err.message);
        console.log('Raw response:', data);
      }
      mongoose.disconnect();
    });
  });

  req.on('error', (e) => {
    console.error(`Request error: ${e.message}`);
    mongoose.disconnect();
  });

  req.end();
}

run().catch(console.error);
