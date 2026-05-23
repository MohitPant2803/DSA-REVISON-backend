import mongoose from 'mongoose';
import Playlist, { IPlaylist } from '../models/playlist.model';
import RevisionCard from '../models/revisionCard.model';

export const createPlaylistService = async (userId: string, data: any): Promise<IPlaylist> => {
  return Playlist.create({ ...data, userId, cardIds: [] });
};

export const getUserPlaylistsService = async (userId: string): Promise<any[]> => {
  return Playlist.find({ userId }).sort('-updatedAt').lean();
};

export const getPlaylistByIdService = async (playlistId: string, userId: string) => {
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

