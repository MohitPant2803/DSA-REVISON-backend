import mongoose from 'mongoose';
import UserQuestionProgress, { AttemptStatus, PerceivedDifficulty } from '../models/userQuestionProgress.model';
import Progress from '../models/progress.model';
import RevisionCard from '../models/revisionCard.model';
import User from '../models/user.model';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { ensureUserSystemPlaylists } from './playlist.service';

/**
 * Atomically syncs the User.focusXxxCardIds arrays in MongoDB.
 * 1. Pull the questionObjectId from ALL 4 focus area arrays (clean slate).
 * 2. If a non-null state is provided, $addToSet it into the matching array.
 */
async function atomicSyncFocusArea(
  userObjectId: mongoose.Types.ObjectId,
  questionObjectId: mongoose.Types.ObjectId,
  state: 'easy' | 'medium' | 'hard' | 'skipped' | null
): Promise<void> {
  try {
    // Step 1: Pull from all 4 arrays
    await User.findByIdAndUpdate(userObjectId, {
      $pull: {
        focusEasyCardIds: questionObjectId,
        focusMediumCardIds: questionObjectId,
        focusHardCardIds: questionObjectId,
        focusSkippedCardIds: questionObjectId,
      },
    });

    // Step 2: Push into the correct array (skip if resetting to null)
    if (state) {
      const fieldMap: Record<string, string> = {
        easy: 'focusEasyCardIds',
        medium: 'focusMediumCardIds',
        hard: 'focusHardCardIds',
        skipped: 'focusSkippedCardIds',
      };
      const listField = fieldMap[state];
      if (listField) {
        await User.findByIdAndUpdate(userObjectId, {
          $addToSet: { [listField]: questionObjectId },
        });
      }
    }
    console.log(`[Focus Area Sync] User ${userObjectId} | Card ${questionObjectId} -> ${state ?? 'removed'}`);
  } catch (err: any) {
    console.error(`[Focus Area Sync Error] Failed to sync focus area: ${err.message}`);
  }
}

export const updateUserQuestionProgress = async (
  userId: string,
  questionId: string,
  state: 'easy' | 'medium' | 'hard' | 'skipped' | null
) => {
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid question ID');
  }

  const cardExists = await RevisionCard.exists({ _id: questionId });
  if (!cardExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Revision card not found');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const questionObjectId = new mongoose.Types.ObjectId(questionId);

  // If state is null, delete the progress record entirely (resetting to unattempted)
  if (state === null) {
    await UserQuestionProgress.deleteOne({ userId: userObjectId, questionId: questionObjectId });
    await Progress.findOneAndUpdate(
      { userId: userObjectId, revisionCardId: questionObjectId },
      { $set: { difficultyState: null, stateChangedAt: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).catch(console.error);
    await ensureUserSystemPlaylists(userId);
    await atomicSyncFocusArea(userObjectId, questionObjectId, null);
    return null;
  }

  const existingRecord = await UserQuestionProgress.findOne({
    userId: userObjectId,
    questionId: questionObjectId,
  });

  // Strict check: if user clicks an already active state again -> delete the row
  if (existingRecord) {
    const isAlreadyActive =
      (state === 'skipped' && existingRecord.attemptStatus === 'skipped') ||
      (state !== 'skipped' && existingRecord.perceivedDifficultyByUser === state);

    if (isAlreadyActive) {
      await UserQuestionProgress.deleteOne({ userId: userObjectId, questionId: questionObjectId });
      await Progress.findOneAndUpdate(
        { userId: userObjectId, revisionCardId: questionObjectId },
        { $set: { difficultyState: null, stateChangedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).catch(console.error);
      await ensureUserSystemPlaylists(userId);
      await atomicSyncFocusArea(userObjectId, questionObjectId, null);
      return null;
    }
  }

  let attemptStatus: AttemptStatus;
  let perceivedDifficultyByUser: PerceivedDifficulty;

  if (state === 'skipped') {
    attemptStatus = 'skipped';
    perceivedDifficultyByUser = null;
  } else {
    attemptStatus = 'attempted';
    perceivedDifficultyByUser = state;
  }

  // Upsert the progress record
  const result = await UserQuestionProgress.findOneAndUpdate(
    { userId: userObjectId, questionId: questionObjectId },
    {
      $set: {
        attemptStatus,
        perceivedDifficultyByUser,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Progress.findOneAndUpdate(
    { userId: userObjectId, revisionCardId: questionObjectId },
    { $set: { difficultyState: state, stateChangedAt: new Date() } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).catch(console.error);

  await ensureUserSystemPlaylists(userId);
  await atomicSyncFocusArea(userObjectId, questionObjectId, state);
  return result;
};
