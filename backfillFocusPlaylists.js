require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  console.log('Fetching all user question progresses...');
  const progressList = await db.collection('userquestionprogresses').find({}).toArray();
  console.log(`Found ${progressList.length} progress records.`);

  // Group by userId
  const userGroups = {};
  progressList.forEach((record) => {
    if (!record.userId || !record.questionId) return;
    const uId = record.userId.toString();
    if (!userGroups[uId]) {
      userGroups[uId] = {
        easy: new Set(),
        medium: new Set(),
        hard: new Set(),
        skipped: new Set(),
      };
    }

    const qId = record.questionId.toString();

    // Map difficulty classifications
    if (record.attemptStatus === 'skipped') {
      userGroups[uId].skipped.add(qId);
    } else if (record.perceivedDifficultyByUser === 'easy') {
      userGroups[uId].easy.add(qId);
    } else if (record.perceivedDifficultyByUser === 'medium') {
      userGroups[uId].medium.add(qId);
    } else if (record.perceivedDifficultyByUser === 'hard') {
      userGroups[uId].hard.add(qId);
    }
  });

  console.log(`Processing backfill for ${Object.keys(userGroups).length} unique users...`);

  for (const [userIdStr, sets] of Object.entries(userGroups)) {
    const userObjectId = new mongoose.Types.ObjectId(userIdStr);
    const easyArray = Array.from(sets.easy).map(id => new mongoose.Types.ObjectId(id));
    const mediumArray = Array.from(sets.medium).map(id => new mongoose.Types.ObjectId(id));
    const hardArray = Array.from(sets.hard).map(id => new mongoose.Types.ObjectId(id));
    const skippedArray = Array.from(sets.skipped).map(id => new mongoose.Types.ObjectId(id));

    console.log(`Updating User ${userIdStr}:`);
    console.log(`  - Easy focus cards: ${easyArray.length}`);
    console.log(`  - Medium focus cards: ${mediumArray.length}`);
    console.log(`  - Hard focus cards: ${hardArray.length}`);
    console.log(`  - Skipped focus cards: ${skippedArray.length}`);

    await db.collection('users').updateOne(
      { _id: userObjectId },
      {
        $set: {
          focusEasyCardIds: easyArray,
          focusMediumCardIds: mediumArray,
          focusHardCardIds: hardArray,
          focusSkippedCardIds: skippedArray,
        }
      }
    );
  }

  console.log('\nMigration complete!');
  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
