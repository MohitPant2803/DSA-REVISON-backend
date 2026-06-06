import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import RevisionCard from '../models/revisionCard.model';
import UserReelSession from '../models/userReelSession.model';
import Playlist from '../models/playlist.model';
import Progress from '../models/progress.model';
import UserCardState from '../models/userCardState.model';

dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI is missing in environment variables');
  process.exit(1);
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runCleanup() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoUri!);
    console.log('✅ Connected successfully!');

    // Find all soft-deleted cards
    const deletedCards = await RevisionCard.find({ isDeleted: true })
      .select('_id')
      .lean();

    const deletedIds = deletedCards.map(c => c._id as string);
    console.log(`ℹ️ Found ${deletedIds.length} soft-deleted cards in database.`);

    if (deletedIds.length === 0) {
      console.log('🎉 No soft-deleted cards found. Nothing to sweep.');
      return;
    }

    // Process in batched chunks of 100 to avoid CPU/IO spikes
    const BATCH_SIZE = 100;
    let processedCount = 0;

    for (let i = 0; i < deletedIds.length; i += BATCH_SIZE) {
      const batchIds = deletedIds.slice(i, i + BATCH_SIZE);
      console.log(`🧹 Processing batch ${i / BATCH_SIZE + 1} (${batchIds.length} card IDs)...`);

      // 1. Clean inactive sessions (older than 15 minutes) to avoid active scrolling index shifts
      const activeThreshold = new Date(Date.now() - 15 * 60 * 1000);
      const sessionResult = await UserReelSession.updateMany(
        { updatedAt: { $lt: activeThreshold } },
        { $pull: { queue: { $in: batchIds } } }
      );
      console.log(`   - Purged from ${sessionResult.modifiedCount} inactive session queues.`);

      // 2. Clean playlists
      const playlistResult = await Playlist.updateMany(
        {},
        { $pull: { cardIds: { $in: batchIds } } }
      );
      console.log(`   - Purged from ${playlistResult.modifiedCount} playlist card registries.`);

      // 3. Clean user bookmarks & favorites
      const progressResult = await Progress.deleteMany({ revisionCardId: { $in: batchIds } });
      const statesResult = await UserCardState.deleteMany({ cardId: { $in: batchIds } });
      console.log(`   - Purged ${progressResult.deletedCount} study progress markers.`);
      console.log(`   - Purged ${statesResult.deletedCount} user bookmarks.`);

      processedCount += batchIds.length;

      // Cooldown delay between batches
      if (i + BATCH_SIZE < deletedIds.length) {
        console.log('⏳ Batched cooldown delay (500ms)...');
        await sleep(500);
      }
    }

    console.log(`\n🎉 Sweeper Complete! Successfully purged references for ${processedCount} soft-deleted cards.`);

  } catch (error) {
    console.error('❌ Sweeper error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

runCleanup();
