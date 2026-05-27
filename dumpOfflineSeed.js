const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;

  console.log('Fetching folders...');
  const rawFolders = await db.collection('folders').find({}).toArray();
  const folders = rawFolders.map(f => ({
    ...f,
    _id: f._id.toString(),
    parentFolderId: f.parentFolderId ? f.parentFolderId.toString() : null,
    createdBy: f.createdBy ? f.createdBy.toString() : null,
    cardIds: f.cardIds ? f.cardIds.map(id => id.toString()) : [],
  }));
  console.log(`Fetched ${folders.length} folders.`);

  console.log('Fetching playlists...');
  const rawPlaylists = await db.collection('playlists').find({}).toArray();
  const playlists = rawPlaylists.map(p => ({
    ...p,
    _id: p._id.toString(),
    createdBy: p.createdBy ? p.createdBy.toString() : null,
    cardIds: p.cardIds ? p.cardIds.map(id => id.toString()) : [],
    orderedCardIds: p.orderedCardIds ? p.orderedCardIds.map(id => id.toString()) : [],
  }));
  console.log(`Fetched ${playlists.length} playlists.`);

  console.log('Fetching revision cards...');
  const rawCards = await db.collection('revisioncards').find({}).toArray();
  const revisionCards = rawCards.map(c => ({
    ...c,
    _id: c._id.toString(),
    folderId: c.folderId ? c.folderId.toString() : null,
    createdBy: typeof c.createdBy === 'object' && c.createdBy !== null && c.createdBy._id
      ? { ...c.createdBy, _id: c.createdBy._id.toString() }
      : c.createdBy ? c.createdBy.toString() : null,
  }));
  console.log(`Fetched ${revisionCards.length} revision cards.`);

  const offlineSeed = {
    folders,
    playlists,
    revisionCards,
    dbVersion: `striver-sde-sheet-${Date.now()}`, // Dynamic timestamp triggers automatic phone cache refresh on APK rebuilds
    timestamp: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, '..', 'dsa-rev-front', 'src', 'constants', 'offlineSeed.json');
  console.log(`Writing offline seed dataset to: ${outputPath}`);
  
  // Ensure the directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(offlineSeed, null, 2), 'utf8');
  console.log('Successfully written offline seed dataset!');

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(console.error);
