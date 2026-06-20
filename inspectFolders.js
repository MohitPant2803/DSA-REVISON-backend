require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;
  
  console.log('--- ROOT FOLDERS (parentFolderId is null or empty) ---');
  const folders = await db.collection('folders').find({}).toArray();
  const roots = folders.filter(f => !f.parentFolderId);
  
  for (const root of roots) {
    console.log(`Root: [${root.title}] (ID: ${root._id}, Icon: ${root.icon}, Color: ${root.color})`);
    
    // Find direct children
    const children = folders.filter(f => f.parentFolderId && f.parentFolderId.toString() === root._id.toString());
    for (const child of children) {
      console.log(`  └─ Child: [${child.title}] (ID: ${child._id}, Icon: ${child.icon}, Color: ${child.color})`);
      
      const grandchildren = folders.filter(f => f.parentFolderId && f.parentFolderId.toString() === child._id.toString());
      for (const gc of grandchildren) {
        console.log(`      └─ Grandchild: [${gc.title}] (ID: ${gc._id}, Icon: ${gc.icon}, Color: ${gc.color})`);
        
        const ggc = folders.filter(f => f.parentFolderId && f.parentFolderId.toString() === gc._id.toString());
        for (const g of ggc) {
          console.log(`          └─ Great-grandchild: [${g.title}] (ID: ${g._id}, Icon: ${g.icon}, Color: ${g.color})`);
        }
      }
    }
  }

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
