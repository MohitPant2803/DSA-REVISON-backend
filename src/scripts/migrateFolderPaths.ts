import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import RevisionCard from '../models/revisionCard.model';
import Folder from '../models/folder.model';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI is missing in environment variables');
  process.exit(1);
}

const resolveFolderMetadata = async (folderId: string) => {
  const subfolderIds: string[] = [];
  const titles: string[] = [];
  let tempFolder = await Folder.findById(folderId).lean() as any;
  
  if (!tempFolder) {
    return null;
  }

  while (tempFolder) {
    subfolderIds.unshift(tempFolder._id as string);
    titles.unshift(tempFolder.title);
    if (tempFolder.parentFolderId) {
      tempFolder = await Folder.findById(tempFolder.parentFolderId).lean() as any;
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
};

async function migrate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri!);
    console.log('✅ Connected successfully!');

    const cards = await RevisionCard.find({
      $or: [
        { rootFolderId: { $exists: false } },
        { isDeleted: { $exists: false } }
      ]
    });

    console.log(`ℹ️ Found ${cards.length} cards requiring migration.`);

    let updatedCount = 0;
    let failCount = 0;

    for (const card of cards) {
      try {
        const metadata = await resolveFolderMetadata(card.folderId);
        
        if (!metadata) {
          console.warn(`⚠️ Folder ${card.folderId} not found for card: ${card.title} (${card._id}). Skipping.`);
          failCount++;
          continue;
        }

        card.rootFolderId = metadata.rootFolderId;
        card.rootFolderName = metadata.rootFolderName;
        card.subfolderPath = metadata.subfolderPath;
        card.subfolderIds = metadata.subfolderIds;
        card.isDeleted = card.isDeleted !== undefined ? card.isDeleted : false;

        await card.save();
        updatedCount++;
      } catch (err: any) {
        console.error(`❌ Failed migrating card ${card._id}: ${err.message}`);
        failCount++;
      }
    }

    console.log(`\n🎉 Migration Complete!`);
    console.log(`   - Successfully updated: ${updatedCount}`);
    console.log(`   - Failed/Skipped: ${failCount}`);

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

migrate();
