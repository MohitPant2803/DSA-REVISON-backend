require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  // Let's find cards where folderId belongs to Striver SDE Sheet or similar folders
  const folders = await db.collection('folders').find({ isDeleted: { $ne: true } }).toArray();
  const striverFolders = folders.filter(f => f.title && (f.title.includes('Striver') || f.subfolderPath && f.subfolderPath.includes('Striver')));
  console.log(`Found ${striverFolders.length} folders related to Striver SDE Sheet.`);
  
  const striverFolderIds = striverFolders.map(f => f._id);
  
  const cards = await db.collection('revisioncards').find({ 
    folderId: { $in: striverFolderIds },
    isDeleted: { $ne: true }
  }).toArray();
  
  console.log(`Found ${cards.length} cards in Striver SDE Sheet:`);
  cards.forEach(c => {
    console.log(`- Card Title: "${c.title}" | ID: ${c._id} | Folder ID: ${c.folderId}`);
  });
  
  await mongoose.disconnect();
}

run().catch(console.error);
