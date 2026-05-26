import mongoose from 'mongoose';
import Progress from '../models/progress.model';
import User from '../models/user.model';
import RevisionCard from '../models/revisionCard.model';
import Folder from '../models/folder.model';
import UserQuestionProgress from '../models/userQuestionProgress.model';
import '../models/folderProgress.model';
import '../models/playlistProgress.model';
import '../models/playlist.model';
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
  const { placardId, revisionCardId, favorite, difficult, archived, timeSpent, addToPlaylist, removeFromPlaylist, difficultyState, ...updateData } = data;

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
  if (difficultyState !== undefined) {
    updatePayload.difficultyState = difficultyState;
    updatePayload.stateChangedAt = new Date();

    if (revisionCardId) {
      const qid = new mongoose.Types.ObjectId(revisionCardId);
      const uid = new mongoose.Types.ObjectId(userId);
      if (difficultyState === null) {
        await UserQuestionProgress.deleteOne({ userId: uid, questionId: qid });
      } else {
        const attemptStatus = difficultyState === 'skipped' ? 'skipped' : 'attempted';
        const perceivedDifficultyByUser = difficultyState === 'skipped' ? null : difficultyState;
        await UserQuestionProgress.findOneAndUpdate(
          { userId: uid, questionId: qid },
          { $set: { attemptStatus, perceivedDifficultyByUser } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }
  }

  const incPayload: Record<string, number> = { revisionCount: 1 };
  if (data.timeSpent) {
    incPayload.timeSpent = data.timeSpent;
  }

  const addToSetPayload: Record<string, unknown> = {};
  const pullPayload: Record<string, unknown> = {};

  if (addToPlaylist) {
    addToSetPayload.playlists = addToPlaylist;
    if (revisionCardId) {
      const mongoose = require('mongoose');
      const Playlist = mongoose.model('Playlist');
      await Playlist.findByIdAndUpdate(addToPlaylist, { $addToSet: { orderedCardIds: revisionCardId } }).catch(() => {});
    }
  }
  if (removeFromPlaylist) {
    pullPayload.playlists = removeFromPlaylist;
    if (revisionCardId) {
      const mongoose = require('mongoose');
      const Playlist = mongoose.model('Playlist');
      await Playlist.findByIdAndUpdate(removeFromPlaylist, { $pull: { orderedCardIds: revisionCardId } }).catch(() => {});
    }
  }

  const updateDoc: any = {
    $set: updatePayload,
    $inc: incPayload,
    $currentDate: { lastViewedAt: true },
    $setOnInsert: setOnInsert,
  };
  if (Object.keys(addToSetPayload).length > 0) updateDoc.$addToSet = addToSetPayload;
  if (Object.keys(pullPayload).length > 0) updateDoc.$pull = pullPayload;

  const progress = await Progress.findOneAndUpdate(
    filter,
    updateDoc,
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
    User.findById(userId).select('streakCount lastCompletedDate name totalSwipes totalScrolls').lean(),
    Progress.aggregate([
      { $match: { userId: objectId, revisionCardId: { $exists: true } } },
      {
        $group: {
          _id: null,
          totalRevisions: { $sum: '$revisionCount' },
          totalTimeSpent: { $sum: '$timeSpent' },
          favorites: { $sum: { $cond: ['$favorite', 1, 0] } },
          difficult: { $sum: { $cond: ['$difficult', 1, 0] } },
          easyCount: { $sum: { $cond: [{ $eq: ['$difficultyState', 'easy'] }, 1, 0] } },
          mediumCount: { $sum: { $cond: [{ $eq: ['$difficultyState', 'medium'] }, 1, 0] } },
          hardCount: { $sum: { $cond: [{ $eq: ['$difficultyState', 'hard'] }, 1, 0] } },
          skippedCount: { $sum: { $cond: [{ $eq: ['$difficultyState', 'skipped'] }, 1, 0] } },
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
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    skippedCount: 0,
  };

  const totalCards = await RevisionCard.countDocuments({ visibility: 'public' });

  return {
    streakCount: user?.streakCount ?? 0,
    lastCompletedDate: user?.lastCompletedDate,
    totalSwipes: user?.totalSwipes ?? 0,
    totalScrolls: user?.totalScrolls ?? 0,
    totalRevisions: overall.totalRevisions,
    totalTimeSpent: overall.totalTimeSpent,
    favoritesCount: overall.favorites,
    difficultCount: overall.difficult,
    easyCount: overall.easyCount ?? 0,
    mediumCount: overall.mediumCount ?? 0,
    hardCount: overall.hardCount ?? 0,
    skippedCount: overall.skippedCount ?? 0,
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
  const user = await User.findById(userId).lean();

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

  const likedOrderedCardIds = user?.preferences?.likedOrderedCardIds || [];
  
  const sortedFavorites = favorites.filter((p) => p.revisionCardId).sort((a: any, b: any) => {
    const idA = a.revisionCardId._id.toString();
    const idB = b.revisionCardId._id.toString();
    const idxA = likedOrderedCardIds.indexOf(idA);
    const idxB = likedOrderedCardIds.indexOf(idB);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime();
  });

  return {
    favorites: sortedFavorites.map(mapEntry),
    archived: archived.filter((p) => p.revisionCardId).map(mapEntry),
    recentBookmarks: bookmarks.filter((p) => p.revisionCardId).map(mapEntry),
  };
};

export const reorderLikesService = async (userId: string, cardIds: string[]) => {
  await User.findByIdAndUpdate(userId, {
    $set: { 'preferences.likedOrderedCardIds': cardIds }
  });
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

export const registerLoopService = async (userId: string, type: 'folder' | 'playlist', id: string, cardsViewed: number) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const targetId = new mongoose.Types.ObjectId(id);

  if (type === 'playlist') {
    const Playlist = mongoose.model('Playlist');
    const PlaylistProgress = mongoose.model('PlaylistProgress');

    // Update global playlist counts
    await Playlist.findOneAndUpdate(
      { _id: targetId, userId: objectId },
      {
        $inc: { completedLoops: 1, totalCardsViewed: cardsViewed },
        $set: { lastCompletedAt: new Date() },
      },
      { new: true }
    ).catch(() => {});

    // Update or insert user's specific progress for this playlist
    const playlistProgress = await PlaylistProgress.findOneAndUpdate(
      { userId: objectId, playlistId: targetId },
      {
        $inc: { completedLoops: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return playlistProgress;
  } else if (type === 'folder') {
    const FolderProgress = mongoose.model('FolderProgress');
    const folderProgress = await FolderProgress.findOneAndUpdate(
      { userId: objectId, folderId: targetId },
      {
        $inc: { completedLoops: 1, totalCardsViewed: cardsViewed },
        $set: { lastCompletedAt: new Date() },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return folderProgress;
  }

  throw new Error('Invalid loop type');
};

export const getFolderLoopsService = async (userId: string) => {
  const FolderProgress = mongoose.model('FolderProgress');
  const loops = await FolderProgress.find({ userId: new mongoose.Types.ObjectId(userId) }).lean();
  return loops.map((p: any) => ({
    folderId: p.folderId,
    completedLoops: p.completedLoops,
    lastCompletedAt: p.lastCompletedAt,
    totalCardsViewed: p.totalCardsViewed,
  }));
};

export const updateResumeStateService = async (
  userId: string,
  type: 'folder' | 'playlist',
  id: string,
  resumeData: {
    resumeCardId?: string;
    lastCardId?: string;
    resumeIndex?: number;
    lastIndex?: number;
    resumeScrollOffset?: number;
  }
) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const targetId = new mongoose.Types.ObjectId(id);

  // Map both naming schemes to ensure compatibility
  const lastCardId = resumeData.lastCardId || resumeData.resumeCardId;
  const lastIndex = resumeData.lastIndex !== undefined ? resumeData.lastIndex : resumeData.resumeIndex;

  const updatePayload: Record<string, any> = {
    resumeTimestamp: new Date(),
  };
  if (lastCardId) {
    updatePayload.resumeCardId = lastCardId;
    updatePayload.lastCardId = lastCardId;
  }
  if (lastIndex !== undefined) {
    updatePayload.resumeIndex = lastIndex;
    updatePayload.lastIndex = lastIndex;
  }
  if (resumeData.resumeScrollOffset !== undefined) {
    updatePayload.resumeScrollOffset = resumeData.resumeScrollOffset;
  }

  if (type === 'playlist') {
    const Playlist = mongoose.model('Playlist');
    const PlaylistProgress = mongoose.model('PlaylistProgress');
    
    // Also save in Playlist (fallback/legacy compatibility)
    const playlistPayload = { ...updatePayload };
    if (lastIndex !== undefined) {
      playlistPayload.lastPlayedIndex = lastIndex;
    }
    await Playlist.findOneAndUpdate(
      { _id: targetId, userId: objectId },
      { $set: playlistPayload },
      { new: true }
    ).catch(() => {});

    // Save in PlaylistProgress (the source of truth now)
    return PlaylistProgress.findOneAndUpdate(
      { userId: objectId, playlistId: targetId },
      { $set: {
          lastCardId,
          lastIndex,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else if (type === 'folder') {
    const FolderProgress = mongoose.model('FolderProgress');
    return FolderProgress.findOneAndUpdate(
      { userId: objectId, folderId: targetId },
      { $set: updatePayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  throw new Error('Invalid resume type');
};

export const getResumeStateService = async (userId: string) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const FolderProgress = mongoose.model('FolderProgress');
  const Playlist = mongoose.model('Playlist');
  const PlaylistProgress = mongoose.model('PlaylistProgress');
  
  const [folderProgress, playlists, playlistProgress] = await Promise.all([
    FolderProgress.find({ userId: objectId }).lean(),
    Playlist.find({ userId: objectId }).lean(),
    PlaylistProgress.find({ userId: objectId }).lean()
  ]);

  // Combine playlists and playlistProgress to populate all info
  const playlistProgressMap = new Map();
  playlistProgress.forEach((pp: any) => {
    playlistProgressMap.set(pp.playlistId.toString(), pp);
  });

  return {
    folders: folderProgress.map((f: any) => ({
      folderId: f.folderId,
      resumeCardId: f.lastCardId || f.resumeCardId,
      lastCardId: f.lastCardId || f.resumeCardId,
      resumeIndex: f.lastIndex !== undefined ? f.lastIndex : f.resumeIndex,
      lastIndex: f.lastIndex !== undefined ? f.lastIndex : f.resumeIndex,
      resumeScrollOffset: f.resumeScrollOffset,
      resumeTimestamp: f.resumeTimestamp || f.updatedAt,
      completedLoops: f.completedLoops || 0,
    })),
    playlists: playlists.map((p: any) => {
      const pp = playlistProgressMap.get(p._id.toString());
      return {
        playlistId: p._id,
        title: p.title || p.name,
        orderedCardIds: p.orderedCardIds || [],
        // Prefer fields from PlaylistProgress if they exist
        resumeCardId: pp?.lastCardId || p.resumeCardId,
        lastCardId: pp?.lastCardId || p.resumeCardId,
        resumeIndex: pp?.lastIndex !== undefined ? pp.lastIndex : (p.lastPlayedIndex !== undefined ? p.lastPlayedIndex : p.resumeIndex),
        lastIndex: pp?.lastIndex !== undefined ? pp.lastIndex : (p.lastPlayedIndex !== undefined ? p.lastPlayedIndex : p.resumeIndex),
        resumeScrollOffset: p.resumeScrollOffset,
        resumeTimestamp: pp?.updatedAt || p.resumeTimestamp || p.updatedAt,
        completedLoops: pp?.completedLoops !== undefined ? pp.completedLoops : (p.completedLoops || 0),
      };
    }),
  };
};

export const syncAnalyticsService = async (userId: string, swipes: number, scrolls: number) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        totalSwipes: swipes,
        totalScrolls: scrolls,
      },
    },
    { new: true, select: 'totalSwipes totalScrolls' }
  ).lean();

  if (!user) {
    throw new Error('User not found');
  }

  return {
    totalSwipes: user.totalSwipes ?? 0,
    totalScrolls: user.totalScrolls ?? 0,
  };
};
