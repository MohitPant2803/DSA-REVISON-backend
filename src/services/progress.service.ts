import mongoose from 'mongoose';
import Progress from '../models/progress.model';
import User from '../models/user.model';
import RevisionCard from '../models/revisionCard.model';
import Folder from '../models/folder.model';
import { updateProgressSchema } from '../validators/progress.validator';
import { z } from 'zod';

type ProgressUpdateInput = z.infer<typeof updateProgressSchema>;

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const cardPopulate = {
  path: 'revisionCardId',
  select: 'title topic difficulty complexity tags explanation code image examples folderId',
  populate: { path: 'folderId', select: 'title icon color' },
};

export const updateProgressService = async (userId: string, data: ProgressUpdateInput) => {
  const { placardId, revisionCardId, favorite, difficult, archived, ...updateData } = data;

  const filter: Record<string, unknown> = { userId };
  const setOnInsert: Record<string, unknown> = { userId };

  if (revisionCardId) {
    filter.revisionCardId = revisionCardId;
    setOnInsert.revisionCardId = revisionCardId;
  } else if (placardId) {
    filter.placardId = placardId;
    setOnInsert.placardId = placardId;
  }

  const updatePayload: Record<string, unknown> = { ...updateData };
  if (favorite !== undefined) updatePayload.favorite = favorite;
  if (difficult !== undefined) updatePayload.difficult = difficult;
  if (archived !== undefined) updatePayload.archived = archived;

  const incPayload: Record<string, number> = { revisionCount: 1 };
  if (data.timeSpent) {
    incPayload.timeSpent = data.timeSpent;
  }

  const progress = await Progress.findOneAndUpdate(
    filter,
    {
      $set: updatePayload,
      $inc: incPayload,
      $currentDate: { lastViewedAt: true },
      $setOnInsert: setOnInsert,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (data.completed && progress && !progress.completedAt) {
    progress.completedAt = new Date();
    await progress.save();

    const user = await User.findById(userId);
    if (user) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (user.lastCompletedDate) {
        if (isSameDay(user.lastCompletedDate, yesterday)) {
          user.streakCount += 1;
        } else if (!isSameDay(user.lastCompletedDate, today)) {
          user.streakCount = 1;
        }
      } else {
        user.streakCount = 1;
      }
      user.lastCompletedDate = today;
      await user.save();
    }
  }

  if (revisionCardId && (favorite !== undefined || difficult !== undefined)) {
    const user = await User.findById(userId);
    if (user && user.lastCompletedDate) {
      const today = new Date();
      if (!isSameDay(user.lastCompletedDate, today)) {
        user.streakCount = Math.max(1, user.streakCount);
        user.lastCompletedDate = today;
        await user.save();
      }
    }
  }

  return progress;
};

export const getDashboardStatsService = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  const [user, overallAgg, recentProgress, weakTopicsAgg, consistencyAgg] = await Promise.all([
    User.findById(userId).select('streakCount lastCompletedDate name').lean(),
    Progress.aggregate([
      { $match: { userId: objectId, revisionCardId: { $exists: true } } },
      {
        $group: {
          _id: null,
          totalRevisions: { $sum: '$revisionCount' },
          totalTimeSpent: { $sum: '$timeSpent' },
          favorites: { $sum: { $cond: ['$favorite', 1, 0] } },
          difficult: { $sum: { $cond: ['$difficult', 1, 0] } },
        },
      },
    ]),
    Progress.find({ userId: objectId, revisionCardId: { $exists: true } })
      .sort({ lastViewedAt: -1 })
      .limit(8)
      .populate(cardPopulate)
      .lean(),
    Progress.aggregate([
      {
        $match: {
          userId: objectId,
          revisionCardId: { $exists: true },
          difficult: true,
        },
      },
      {
        $lookup: {
          from: 'revisioncards',
          localField: 'revisionCardId',
          foreignField: '_id',
          as: 'card',
        },
      },
      { $unwind: '$card' },
      {
        $group: {
          _id: '$card.topic',
          count: { $sum: 1 },
          lastSeen: { $max: '$lastViewedAt' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, topic: '$_id', count: 1, lastSeen: 1 } },
    ]),
    Progress.aggregate([
      {
        $match: {
          userId: objectId,
          revisionCardId: { $exists: true },
          lastViewedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastViewedAt' },
          },
          sessions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const overall = overallAgg[0] || {
    totalRevisions: 0,
    totalTimeSpent: 0,
    favorites: 0,
    difficult: 0,
  };

  const totalCards = await RevisionCard.countDocuments({ visibility: 'public' });

  return {
    streakCount: user?.streakCount ?? 0,
    lastCompletedDate: user?.lastCompletedDate,
    totalRevisions: overall.totalRevisions,
    totalTimeSpent: overall.totalTimeSpent,
    favoritesCount: overall.favorites,
    difficultCount: overall.difficult,
    totalCardsAvailable: totalCards,
    recentlyRevised: recentProgress
      .filter((p) => p.revisionCardId)
      .map((p) => ({
        progressId: p._id,
        lastViewedAt: p.lastViewedAt,
        revisionCount: p.revisionCount,
        card: p.revisionCardId,
      })),
    weakTopics: weakTopicsAgg,
    consistencyByDay: consistencyAgg.map((d) => ({
      date: d._id,
      sessions: d.sessions,
    })),
  };
};

export const getPersonalLibraryService = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  const [favorites, archived, bookmarks] = await Promise.all([
    Progress.find({ userId: objectId, favorite: true, archived: { $ne: true } })
      .sort({ lastViewedAt: -1 })
      .populate(cardPopulate)
      .lean(),
    Progress.find({ userId: objectId, archived: true })
      .sort({ updatedAt: -1 })
      .populate(cardPopulate)
      .lean(),
    Progress.find({
      userId: objectId,
      revisionCardId: { $exists: true },
      favorite: { $ne: true },
      archived: { $ne: true },
    })
      .sort({ lastViewedAt: -1 })
      .limit(20)
      .populate(cardPopulate)
      .lean(),
  ]);

  const mapEntry = (p: any) => ({
    progressId: p._id,
    lastViewedAt: p.lastViewedAt,
    favorite: p.favorite,
    difficult: p.difficult,
    archived: p.archived,
    card: p.revisionCardId,
  });

  return {
    favorites: favorites.filter((p) => p.revisionCardId).map(mapEntry),
    archived: archived.filter((p) => p.revisionCardId).map(mapEntry),
    recentBookmarks: bookmarks.filter((p) => p.revisionCardId).map(mapEntry),
  };
};

export const getAdminAnalyticsService = async () => {
  const [userCounts, folderCount, cardCount, revisionsToday] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Folder.countDocuments(),
    RevisionCard.countDocuments(),
    Progress.countDocuments({
      lastViewedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
  ]);

  return {
    usersByRole: userCounts,
    folderCount,
    cardCount,
    revisionsToday,
  };
};
