import Bookmark, { IBookmark } from '../models/bookmark.model';

export const toggleBookmarkService = async (userId: string, placardId: string) => {
  const existingBookmark = await Bookmark.findOne({ userId, placardId });

  if (existingBookmark) {
    await existingBookmark.deleteOne();
    return { isBookmarked: false, message: 'Removed from favorites' };
  }

  await Bookmark.create({ userId, placardId });
  return { isBookmarked: true, message: 'Added to favorites' };
};

export const getUserBookmarksService = async (userId: string, query: any) => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const sortStr = query.sort || '-createdAt';

  const bookmarks = await Bookmark.find({ userId })
    .sort(sortStr)
    .skip(skip)
    .limit(limit)
    .populate('placardId') // Optionally specify fields: 'title slug difficulty tags'
    .lean();

  const total = await Bookmark.countDocuments({ userId });

  return {
    items: bookmarks.map(b => b.placardId),
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};