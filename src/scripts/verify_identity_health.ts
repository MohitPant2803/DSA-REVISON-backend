import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Folder from '../models/folder.model';
import RevisionCard from '../models/revisionCard.model';
import Playlist from '../models/playlist.model';
import Progress from '../models/progress.model';
import FolderProgress from '../models/folderProgress.model';
import UserCardState from '../models/userCardState.model';
import UserQuestionProgress from '../models/userQuestionProgress.model';
import ProcessedMutation from '../models/processedMutation.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_revision';

const isValidId = (id: any): boolean => {
  if (typeof id !== 'string' && !(id instanceof mongoose.Types.ObjectId)) return false;
  const idStr = id.toString();
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return objectIdRegex.test(idStr) || uuidRegex.test(idStr);
};

async function runHealthCheck() {
  console.log('======================================================================');
  console.log('🔬 BACKEND IDENTITY HEALTH CHECK DIAGNOSTIC REPORT');
  console.log('======================================================================');

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // 1. Temp IDs Check
    let tempFolders = 0;
    let tempCards = 0;
    let tempPlaylists = 0;

    const folders = await Folder.find({}).lean();
    const cards = await RevisionCard.find({}).lean();
    const playlists = await Playlist.find({}).lean();

    folders.forEach(f => {
      if (f._id.toString().startsWith('temp-')) tempFolders++;
    });
    cards.forEach(c => {
      if (c._id.toString().startsWith('temp-')) tempCards++;
    });
    playlists.forEach(p => {
      if (p._id.toString().startsWith('temp-')) tempPlaylists++;
    });

    console.log(`\n1. Temporary IDs Found:`);
    console.log(`   - Folders: ${tempFolders}`);
    console.log(`   - Cards: ${tempCards}`);
    console.log(`   - Playlists: ${tempPlaylists}`);

    // 2. Duplicate Folders Check
    const folderKeys = new Set<string>();
    let duplicateFolders = 0;
    folders.forEach(f => {
      const key = `${f.title}|${f.parentFolderId?.toString() || ''}|${f.createdBy?.toString()}`;
      if (folderKeys.has(key)) {
        duplicateFolders++;
      } else {
        folderKeys.add(key);
      }
    });

    // 3. Duplicate Cards Check
    const cardKeys = new Set<string>();
    let duplicateCards = 0;
    cards.forEach(c => {
      const key = `${c.title}|${c.topic}|${c.folderId?.toString()}`;
      if (cardKeys.has(key)) {
        duplicateCards++;
      } else {
        cardKeys.add(key);
      }
    });

    console.log(`\n2. Duplicate Entities:`);
    console.log(`   - Duplicate Folders (Same Title & User): ${duplicateFolders}`);
    console.log(`   - Duplicate Cards (Same Title, Topic, & Folder): ${duplicateCards}`);

    // 4. Orphaned Cards Check
    const folderIds = new Set(folders.map(f => f._id.toString()));
    let orphanedCards = 0;
    cards.forEach(c => {
      if (c.folderId && !folderIds.has(c.folderId.toString())) {
        orphanedCards++;
      }
    });

    console.log(`\n3. Orphaned References:`);
    console.log(`   - Orphaned Cards (Folder does not exist): ${orphanedCards}`);

    // 5. Invalid Reference Formats
    let invalidFolderRefs = 0;
    let invalidCardRefs = 0;
    let invalidPlaylistRefs = 0;

    // Check Folder parentFolderId
    folders.forEach(f => {
      if (f.parentFolderId && !isValidId(f.parentFolderId)) invalidFolderRefs++;
    });
    // Check Card folderId
    cards.forEach(c => {
      if (c.folderId && !isValidId(c.folderId)) invalidCardRefs++;
    });
    // Check Playlist cardIds
    playlists.forEach(p => {
      if (p.cardIds) {
        p.cardIds.forEach(cid => {
          if (!isValidId(cid)) invalidCardRefs++;
        });
      }
    });

    console.log(`\n4. Invalid Reference Formats (Neither valid ObjectId nor UUID):`);
    console.log(`   - Invalid Folder References: ${invalidFolderRefs}`);
    console.log(`   - Invalid Card/Question References: ${invalidCardRefs}`);

    // 6. Translation Map Usage
    const processedMutations = await ProcessedMutation.find({}).lean();
    let mutationsWithTranslations = 0;
    processedMutations.forEach(pm => {
      if (pm.translations && Object.keys(pm.translations).length > 0) {
        mutationsWithTranslations++;
      }
    });

    console.log(`\n5. Translation Map Usage:`);
    console.log(`   - Processed Mutations containing translation maps: ${mutationsWithTranslations}`);

    console.log('\n======================================================================');
    const totalHealthErrors = tempFolders + tempCards + tempPlaylists + duplicateFolders + duplicateCards + orphanedCards + invalidFolderRefs + invalidCardRefs + mutationsWithTranslations;
    if (totalHealthErrors === 0) {
      console.log('✅ HEALTH STATUS: PERFECT (No identity errors detected)');
    } else {
      console.log(`❌ HEALTH STATUS: WARN (${totalHealthErrors} identity discrepancies detected)`);
    }
    console.log('======================================================================\n');

  } catch (err: any) {
    console.error('❌ Failed to execute backend health check:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runHealthCheck();
