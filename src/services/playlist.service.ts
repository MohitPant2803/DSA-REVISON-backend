import Playlist, { IPlaylist } from '../models/playlist.model';
import PlaylistItem from '../models/playlistItem.model';

export const createPlaylistService = async (userId: string, data: any): Promise<IPlaylist> => {
  return Playlist.create({ ...data, userId });
};

export const getUserPlaylistsService = async (userId: string) => {
  return Playlist.find({ userId }).sort('-updatedAt').lean();
};

export const getPlaylistByIdService = async (playlistId: string, userId: string, query: any) => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId }).lean();
  if (!playlist) return null;

  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const items = await PlaylistItem.find({ playlistId })
    .sort('-addedAt')
    .skip(skip)
    .limit(limit)
    .populate('placardId')
    .lean();

  const total = await PlaylistItem.countDocuments({ playlistId });

  return {
    playlist,
    items: items.map(i => i.placardId),
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export const deletePlaylistService = async (playlistId: string, userId: string) => {
  const result = await Playlist.findOneAndDelete({ _id: playlistId, userId });
  if (result) {
    // Cascading delete items in the background
    PlaylistItem.deleteMany({ playlistId }).exec();
  }
  return !!result;
};

export const addPlacardToPlaylistService = async (playlistId: string, placardId: string, userId: string) => {
  // Verify ownership
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  try {
    await PlaylistItem.create({ playlistId, placardId });
    // Auto-increment count
    playlist.itemCount += 1;
    await playlist.save();
    return true;
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate item entry, fail gracefully
      throw new Error('Item already exists in playlist');
    }
    throw error;
  }
};

export const removePlacardFromPlaylistService = async (playlistId: string, placardId: string, userId: string) => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const result = await PlaylistItem.findOneAndDelete({ playlistId, placardId });
  if (result) {
    // Auto-decrement count
    playlist.itemCount = Math.max(0, playlist.itemCount - 1);
    await playlist.save();
  }
  return !!result;
};