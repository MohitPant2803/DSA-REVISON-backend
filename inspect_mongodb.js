require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Error: MONGO_URI not defined in environment/dotenv');
  process.exit(1);
}

async function run() {
  await mongoose.connect(mongoUri, { dbName: 'test' });
  const db = mongoose.connection.db;
  
  const folderTitles = ["Binary Search", "Strings"];
  
  for (const title of folderTitles) {
    console.log(`\n====================================================`);
    console.log(`Checking folder: "${title}"`);
    console.log(`====================================================`);
    
    // Find all folders with this title
    const folders = await db.collection('folders').find({ title }).toArray();
    console.log(`Found ${folders.length} folders with title "${title}":`);
    
    for (const folder of folders) {
      console.log(`Folder ID: ${folder._id} | Parent: ${folder.parentFolderId}`);
      
      const cards = await db.collection('revisioncards').find({ 
        folderId: folder._id,
        isDeleted: { $ne: 1 }
      }).sort({ order: 1 }).toArray();
      
      console.log(`Cards inside this folder (${cards.length}):`);
      cards.forEach((c, idx) => {
        console.log(`  ${idx + 1}. Title: "${c.title}" | Order: ${c.order} | ID: ${c._id}`);
      });
    }
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
