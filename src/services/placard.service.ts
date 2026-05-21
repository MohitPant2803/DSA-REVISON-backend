import Placard, { IPlacard } from '../models/placard.model';
import { CreatePlacardInput } from '../validators/placard.validator';

// Helper for slug generation
const generateSlug = (title: string): string => {
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const uniqueSuffix = Math.random().toString(36).substring(2, 7);
  return `${baseSlug}-${uniqueSuffix}`;
};

export const createPlacardService = async (
  data: CreatePlacardInput,
  createdBy: string
): Promise<IPlacard> => {
  const slug = data.slug || generateSlug(data.title);
  
  return Placard.create({
    ...data,
    slug,
    createdBy,
  });
};

export const updatePlacardService = async (
  id: string,
  data: Partial<CreatePlacardInput>
): Promise<IPlacard | null> => {
  return Placard.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deletePlacardService = async (id: string): Promise<boolean> => {
  const result = await Placard.findByIdAndDelete(id);
  return !!result;
};

export const getPlacardsByCategoryService = async (
  categoryId: string,
  query: any,
  requirePublished: boolean = true
) => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const filter: any = { categoryId };
  
  if (requirePublished) filter.isPublished = true;
  if (query.search) filter.title = { $regex: query.search, $options: 'i' };
  if (query.difficulty) filter.difficulty = query.difficulty;
  
  if (query.tags) {
    const tagsArray = query.tags.split(',').map((t: string) => t.trim());
    filter.tags = { $in: tagsArray };
  }

  const sortStr = query.sort ? query.sort.split(',').join(' ') : 'order';

  const placards = await Placard.find(filter)
    .sort(sortStr)
    .skip(skip)
    .limit(limit)
    .select('-walkthrough -mcqs') // Exclude heavy details for list view
    .lean();

  const total = await Placard.countDocuments(filter);

  return {
    placards,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getPlacardByIdService = async (id: string) => {
  return Placard.findById(id).populate('categoryId', 'title slug').lean();
};