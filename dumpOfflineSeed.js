require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const mongoUri = process.env.MONGO_URI;

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
  const playlists = [];
  console.log(`Fetched 0 playlists (skipped custom user data).`);

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

  console.log('Fetching senior quotes...');
  const rawQuotes = await db.collection('seniorquotes').find({}).toArray();
  const seniorQuotes = rawQuotes.map(q => ({
    ...q,
    _id: q._id.toString(),
  }));
  console.log(`Fetched ${seniorQuotes.length} senior quotes.`);

  const offlineSeed = {
    folders,
    playlists,
    revisionCards,
    seniorQuotes,
    dbVersion: `striver-sde-sheet-${Date.now()}`, // Dynamic timestamp triggers automatic phone cache refresh on APK rebuilds
    timestamp: new Date().toISOString(),
  };

  const outputPath1 = path.join(__dirname, '..', 'dsa-rev-front', 'src', 'constants', 'offlineSeed.json');
  const outputPath2 = path.join(__dirname, '..', 'dsa-rev-front', 'src', 'components', 'constants', 'offlineSeed.json');
  console.log(`Writing offline seed dataset to: ${outputPath1} and ${outputPath2}`);
  
  // Ensure the directories exist
  fs.mkdirSync(path.dirname(outputPath1), { recursive: true });
  fs.mkdirSync(path.dirname(outputPath2), { recursive: true });
  
  const jsonContent = JSON.stringify(offlineSeed, null, 2);
  fs.writeFileSync(outputPath1, jsonContent, 'utf8');
  fs.writeFileSync(outputPath2, jsonContent, 'utf8');
  console.log('Successfully written offline seed datasets!');

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(console.error);
