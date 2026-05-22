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
  const limit = Math.min(parseInt(query.limit || '100', 10), 200);
  const skip = (page - 1) * limit;

  const itemDocs = await PlaylistItem.find({ playlistId })
    .sort('-addedAt')
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await PlaylistItem.countDocuments({ playlistId });

  const cardIds = itemDocs
    .map((i) => i.revisionCardId?.toString() || i.placardId?.toString())
    .filter(Boolean);

  return {
    playlist,
    cardIds,
    items: cardIds,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

export const deletePlaylistService = async (playlistId: string, userId: string) => {
  const result = await Playlist.findOneAndDelete({ _id: playlistId, userId });
  if (result) {
    PlaylistItem.deleteMany({ playlistId }).exec();
  }
  return !!result;
};

export const addItemToPlaylistService = async (
  playlistId: string,
  userId: string,
  opts: { placardId?: string; revisionCardId?: string }
) => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const payload: Record<string, unknown> = { playlistId };
  if (opts.revisionCardId) payload.revisionCardId = opts.revisionCardId;
  else if (opts.placardId) payload.placardId = opts.placardId;
  else throw new Error('Either placardId or revisionCardId is required');

  try {
    await PlaylistItem.create(payload);
    playlist.itemCount += 1;
    await playlist.save();
    return true;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('Item already exists in playlist');
    }
    throw error;
  }
};

export const removeItemFromPlaylistService = async (
  playlistId: string,
  userId: string,
  opts: { placardId?: string; revisionCardId?: string }
) => {
  const playlist = await Playlist.findOne({ _id: playlistId, userId });
  if (!playlist) throw new Error('Playlist not found or unauthorized');

  const filter: Record<string, unknown> = { playlistId };
  if (opts.revisionCardId) filter.revisionCardId = opts.revisionCardId;
  else if (opts.placardId) filter.placardId = opts.placardId;
  else return false;

  const result = await PlaylistItem.findOneAndDelete(filter);
  if (result) {
    playlist.itemCount = Math.max(0, playlist.itemCount - 1);
    await playlist.save();
  }
  return !!result;
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
