const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;
  
  console.log('--- ROOT FOLDERS (parentFolderId is null or empty) ---');
  const folders = await db.collection('folders').find({}).toArray();
  const roots = folders.filter(f => !f.parentFolderId);
  
  for (const root of roots) {
    console.log(`Root: [${root.title}] (ID: ${root._id})`);
    
    // Find direct children
    const children = folders.filter(f => f.parentFolderId && f.parentFolderId.toString() === root._id.toString());
    for (const child of children) {
      console.log(`  └─ Child: [${child.title}] (ID: ${child._id})`);
      
      const grandchildren = folders.filter(f => f.parentFolderId && f.parentFolderId.toString() === child._id.toString());
      for (const gc of grandchildren) {
        console.log(`      └─ Grandchild: [${gc.title}] (ID: ${gc._id})`);
        
        const ggc = folders.filter(f => f.parentFolderId && f.parentFolderId.toString() === gc._id.toString());
        for (const g of ggc) {
          console.log(`          └─ Great-grandchild: [${g.title}] (ID: ${g._id})`);
        }
      }
    }
  }

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
