import Category, { ICategory } from '../models/category.model';
import { QueryInput } from '../validators/domain.validator';

export const createCategoryService = async (data: any): Promise<ICategory> => {
  return Category.create(data);
};

export const getCategoriesByDomainService = async (domainId: string, query: QueryInput) => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const filter: any = { domainId };
  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  const sortStr = query.sort ? query.sort.split(',').join(' ') : 'order';

  const categories = await Category.find(filter)
    .sort(sortStr)
    .skip(skip)
    .limit(limit)
    .populate('domainId', 'title slug')
    .lean();

  const total = await Category.countDocuments(filter);

  return {
    categories,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getCategoryBySlugService = async (slug: string) => {
  return Category.findOne({ slug }).populate('domainId', 'title slug').lean();
};