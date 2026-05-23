import mongoose from 'mongoose';
import UserQuestionProgress, { AttemptStatus, PerceivedDifficulty } from '../models/userQuestionProgress.model';
import Progress from '../models/progress.model';
import RevisionCard from '../models/revisionCard.model';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

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

  return result;
};
