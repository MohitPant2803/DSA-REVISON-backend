import mongoose from 'mongoose';
import Playlist, { IPlaylist } from '../models/playlist.model';
import RevisionCard from '../models/revisionCard.model';
import Progress from '../models/progress.model';

export const createPlaylistService = async (userId: string, data: any): Promise<IPlaylist> => {
  return Playlist.create({ ...data, userId, cardIds: [] });
};

export const getUserPlaylistsService = async (userId: string): Promise<any[]> => {
  const [easyCount, mediumCount, hardCount, skippedCount, customPlaylists] = await Promise.all([
    Progress.countDocuments({ userId: new mongoose.Types.ObjectId(userId), difficultyState: 'easy' }),
    Progress.countDocuments({ userId: new mongoose.Types.ObjectId(userId), difficultyState: 'medium' }),
    Progress.countDocuments({ userId: new mongoose.Types.ObjectId(userId), difficultyState: 'hard' }),
    Progress.countDocuments({ userId: new mongoose.Types.ObjectId(userId), difficultyState: 'skipped' }),
    Playlist.find({ userId }).sort('-updatedAt').lean(),
  ]);

  const smartPlaylists = [
    {
      _id: 'easy',
      id: 'easy',
      name: 'Easy',
      title: 'Easy',
      description: 'Dynamic list of cards you marked as Easy',
      itemCount: easyCount,
      completedLoops: 0,
      totalCardsViewed: 0,
      color1: '#10B981',
      color2: '#059669',
      cardIds: [],
    },
    {
      _id: 'medium',
      id: 'medium',
      name: 'Medium',
      title: 'Medium',
      description: 'Dynamic list of cards you marked as Medium',
      itemCount: mediumCount,
      completedLoops: 0,
      totalCardsViewed: 0,
      color1: '#F59E0B',
      color2: '#D97706',
      cardIds: [],
    },
    {
      _id: 'hard',
      id: 'hard',
      name: 'Hard',
      title: 'Hard',
      description: 'Dynamic list of cards you marked as Hard',
      itemCount: hardCount,
      completedLoops: 0,
      totalCardsViewed: 0,
      color1: '#EF4444',
      color2: '#DC2626',
      cardIds: [],
    },
    {
      _id: 'skipped',
      id: 'skipped',
      name: 'Skipped',
      title: 'Skipped',
      description: 'Dynamic list of cards you skipped',
      itemCount: skippedCount,
      completedLoops: 0,
      totalCardsViewed: 0,
      color1: '#64748B',
      color2: '#475569',
      cardIds: [],
    },
  ];

  return [...smartPlaylists, ...customPlaylists];
};

export const getPlaylistByIdService = async (playlistId: string, userId: string) => {
  if (['easy', 'medium', 'hard', 'skipped'].includes(playlistId)) {
    const progressRecords = await Progress.find({
      userId: new mongoose.Types.ObjectId(userId),
      difficultyState: playlistId,
    })
      .populate({
        path: 'revisionCardId',
        select: 'title topic difficulty complexity tags explanation code image examples folderId',
        populate: { path: 'folderId', select: 'title icon color' },
      })
      .sort({ updatedAt: -1 })
      .lean();

    const cards = progressRecords
      .map((p: any) => p.revisionCardId)
      .filter((c: any) => c && c._id);

    const cardIds = cards.map((c: any) => c._id.toString());

    const name = playlistId.charAt(0).toUpperCase() + playlistId.slice(1);

    const playlist = {
      _id: playlistId,
      id: playlistId,
      name,
      title: name,
      description: `Dynamic list of cards you marked as ${name}`,
      itemCount: cards.length,
      completedLoops: 0,
      totalCardsViewed: 0,
      color1: playlistId === 'easy' ? '#10B981' : playlistId === 'medium' ? '#F59E0B' : playlistId === 'hard' ? '#EF4444' : '#64748B',
      color2: playlistId === 'easy' ? '#059669' : playlistId === 'medium' ? '#D97706' : playlistId === 'hard' ? '#DC2626' : '#475569',
      cardIds,
    };

    return {
      playlist,
      cardIds,
      items: cards,
    };
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return null;
  }

  const playlist = await Playlist.findOne({ _id: playlistId, userId }).lean();
  if (!playlist) return null;

  const cardIds = playlist.cardIds || [];

  return {
    playlist,
    cardIds,
    items: cardIds,
  };
};

export const deletePlaylistService = async (playlistId: string, userId: string): Promise<boolean> => {
  const result = await Playlist.findOneAndDelete({ _id: playlistId, userId });
  return !!result;
};

export const addItemToPlaylistService = async (
  playlistId: string,
  userId: string,
  opts: { placardId?: string; revisionCardId?: string }
): Promise<boolean> => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const cardIdStr = opts.revisionCardId || opts.placardId;
  if (!cardIdStr) throw new Error('Either placardId or revisionCardId is required');

  if (!playlist.cardIds) {
    playlist.cardIds = [];
  }

  const alreadyExists = playlist.cardIds.some((id) => id.toString() === cardIdStr);
  if (alreadyExists) {
    throw new Error('Item already exists in playlist');
  }

  playlist.cardIds.push(new mongoose.Types.ObjectId(cardIdStr));
  playlist.itemCount = playlist.cardIds.length;
  await playlist.save();
  return true;
};

export const removeItemFromPlaylistService = async (
  playlistId: string,
  userId: string,
  opts: { placardId?: string; revisionCardId?: string }
): Promise<boolean> => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const cardIdStr = opts.revisionCardId || opts.placardId;
  if (!cardIdStr) return false;

  if (!playlist.cardIds) {
    return false;
  }

  const lengthBefore = playlist.cardIds.length;
  playlist.cardIds = playlist.cardIds.filter((id) => id.toString() !== cardIdStr);

  if (playlist.cardIds.length !== lengthBefore) {
    playlist.itemCount = playlist.cardIds.length;
    await playlist.save();
    return true;
  }

  return false;
};

/** @deprecated use addItemToPlaylistService */
export const addPlacardToPlaylistService = async (
  playlistId: string,
  placardId: string,
  userId: string
) => addItemToPlaylistService(playlistId, userId, { revisionCardId: placardId });

/** @deprecated use removeItemFromPlaylistService */
export const removePlacardFromPlaylistService = async (
  playlistId: string,
  placardId: string,
  userId: string
) => removeItemFromPlaylistService(playlistId, userId, { revisionCardId: placardId });

export const reorderPlaylistService = async (playlistId: string, userId: string, cardIds: string[]) => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  playlist.cardIds = cardIds.map((id) => new mongoose.Types.ObjectId(id));
  playlist.customOrderUpdatedAt = new Date();
  await playlist.save();
  return playlist;
};

export const updatePlaylistService = async (
  playlistId: string,
  userId: string,
  data: { name?: string; description?: string; color1?: string; color2?: string }
): Promise<IPlaylist | null> => {
  return Playlist.findOneAndUpdate({ _id: playlistId, userId }, data, { new: true });
};

export const duplicatePlaylistService = async (
  playlistId: string,
  userId: string
): Promise<IPlaylist | null> => {
  const original = await Playlist.findOne({ _id: playlistId, userId });
  if (!original) return null;

  return Playlist.create({
    name: `${original.name} Copy`,
    userId,
    cardIds: original.cardIds || [],
    itemCount: original.itemCount || 0,
    color1: original.color1,
    color2: original.color2,
  });
};

