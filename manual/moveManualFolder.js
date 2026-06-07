require('dotenv').config();
const mongoose = require('mongoose');

// Define Schema for path resolution
const FolderSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  parentFolderId: { type: String, default: null }
}, { timestamps: true });

const Folder = mongoose.models.Folder || mongoose.model('Folder', FolderSchema);

// Helper function to resolve denormalized path metadata for a folder leaf
async function resolveFolderMetadata(folderId, db) {
  const subfolderIds = [];
  const titles = [];
  let tempFolder = await db.collection('folders').findOne({ _id: folderId });
  
  if (!tempFolder) {
    throw new Error(`Folder with ID ${folderId} not found during path resolution.`);
  }

  while (tempFolder) {
    subfolderIds.unshift(tempFolder._id);
    titles.unshift(tempFolder.title);
    if (tempFolder.parentFolderId) {
      tempFolder = await db.collection('folders').findOne({ _id: tempFolder.parentFolderId });
    } else {
      break;
    }
  }

  return {
    rootFolderId: subfolderIds[0],
    rootFolderName: titles[0],
    subfolderPath: '/' + titles.join('/'),
    subfolderIds,
  };
}

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from your .env file!');
  }

  // ==========================================
  // CONFIGURATION: Set your folder move details: node manual/moveManualFolder.js
  // ==========================================
  const targetFolderId = "42ded5b2-27a9-48dc-9d7b-4474114d1969"; // Folder you want to move
  const newParentFolderId = "7a28783b-5b8b-48d7-a99d-15e7016c5e04"; // New parent folder UUID, or null to make it a Root Folder

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Fetch target folder
  const targetFolder = await db.collection('folders').findOne({ _id: targetFolderId });
  if (!targetFolder) {
    console.log(`⚠️ Folder to move ("${targetFolderId}") not found.`);
    await mongoose.disconnect();
    return;
  }

  // 2. Fetch new parent folder (if not null)
  if (newParentFolderId) {
    const newParent = await db.collection('folders').findOne({ _id: newParentFolderId });
    if (!newParent) {
      console.log(`⚠️ New parent folder ("${newParentFolderId}") not found.`);
      await mongoose.disconnect();
      return;
    }
    // Prevent nesting a folder inside itself
    if (targetFolderId === newParentFolderId) {
       console.log('⚠️ Cannot move a folder inside itself.');
       await mongoose.disconnect();
       return;
    }
  }

  console.log(`Moving Folder: "${targetFolder.title}" (${targetFolderId})`);
  console.log(`New Parent ID: ${newParentFolderId ? `"${newParentFolderId}"` : 'null (Root level)'}`);

  // 3. Update the folder's parentFolderId
  await db.collection('folders').updateOne(
    { _id: targetFolderId },
    { 
      $set: { 
        parentFolderId: newParentFolderId,
        updatedAt: new Date()
      } 
    }
  );
  console.log('✅ Updated parentFolderId on target folder document.');

  // 4. Build the complete subfolder tree recursively to find all descendant folders
  console.log('Gathering child subfolders recursively...');
  const allFolders = await db.collection('folders').find({}).toArray();
  const folderChildrenMap = new Map();
  allFolders.forEach(f => {
    if (f.parentFolderId) {
      const parent = f.parentFolderId.toString();
      const list = folderChildrenMap.get(parent) || [];
      list.push(f._id.toString());
      folderChildrenMap.set(parent, list);
    }
  });

  const descendantFolderIds = [targetFolderId];
  const queue = [targetFolderId];
  while (queue.length > 0) {
    const currentId = queue.shift();
    const children = folderChildrenMap.get(currentId) || [];
    for (const childId of children) {
      if (!descendantFolderIds.includes(childId)) {
        descendantFolderIds.push(childId);
        queue.push(childId);
      }
    }
  }
  console.log(`- Folder sub-tree found: ${descendantFolderIds.length} folders total.`);

  // 5. Query all cards situated inside these moving folders
  console.log('Fetching cards inside moving folders...');
  const cardsToUpdate = await db.collection('revisioncards')
    .find({ folderId: { $in: descendantFolderIds }, isDeleted: { $ne: true } })
    .toArray();

  console.log(`- Found ${cardsToUpdate.length} cards that need path updates.`);

  // 6. Recalculate path metadata for each card and save
  let updateCount = 0;
  for (const card of cardsToUpdate) {
    try {
      const newPathMetadata = await resolveFolderMetadata(card.folderId, db);
      
      await db.collection('revisioncards').updateOne(
        { _id: card._id },
        { 
          $set: { 
            ...newPathMetadata,
            updatedAt: new Date() // Force client sync
          } 
        }
      );
      updateCount++;
    } catch (cardErr) {
      console.warn(`⚠️ Failed updating path for card: "${card.title}" (${card._id})`, cardErr.message);
    }
  }

  console.log(`- Successfully updated path metadata on ${updateCount} cards.`);
  console.log(`\n🎉 Folder migration successfully completed!`);

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
