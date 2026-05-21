import Domain, { IDomain } from '../models/domain.model';
import { CreateDomainInput, QueryInput } from '../validators/domain.validator';

export const createDomainService = async (data: CreateDomainInput): Promise<IDomain> => {
  return Domain.create(data);
};

export const getDomainsService = async (query: QueryInput) => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }
  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  const sortStr = query.sort ? query.sort.split(',').join(' ') : 'order';

  const domains = await Domain.find(filter)
    .sort(sortStr)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Domain.countDocuments(filter);

  return {
    domains,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getDomainBySlugService = async (slug: string) => {
  return Domain.findOne({ slug }).lean();
};