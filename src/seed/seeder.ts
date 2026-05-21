import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env';
import { connectDB } from '../config/db';
import { logger } from '../utils/logger';
import { parseJsonFile } from './jsonParser';

import User from '../models/user.model';
import Domain from '../models/domain.model';
import Category from '../models/category.model';
import Placard from '../models/placard.model';

import { createDomainSchema } from '../validators/domain.validator';
import { createCategorySchema } from '../validators/category.validator';
import { createPlacardSchema } from '../validators/placard.validator';

const seedDataDir = path.resolve(process.cwd(), 'src/seed/data');

const getOrCreateSystemAdmin = async () => {
  let admin = await User.findOne({ email: 'system@admin.com' });
  if (!admin) {
    admin = await User.create({
      name: 'System Auto-Seeder',
      email: 'system@admin.com',
      role: 'superadmin',
    });
    logger.info('👤 Created System Admin User');
  }
  return admin._id.toString();
};

const seedModule = async (folderName: string, adminId: string) => {
  logger.info(`\n🚀 Starting seed for module: [${folderName.toUpperCase()}]`);
  const basePath = path.join(seedDataDir, folderName);

  // 1. Process Domain
  const domainData = await parseJsonFile<any>(path.join(basePath, 'domain.json'));
  let domainId = null;
  
  if (domainData) {
    const validatedDomain = createDomainSchema.parse(domainData);
    const domain = await Domain.findOneAndUpdate(
      { slug: validatedDomain.slug },
      { $set: validatedDomain },
      { upsert: true, new: true }
    );
    domainId = domain._id.toString();
    logger.info(`✅ Upserted Domain: ${domain.title}`);
  } else {
    logger.warn(`⚠️ No domain.json found in ${folderName}. Skipping module.`);
    return;
  }

  // 2. Process Categories
  const categoriesData = await parseJsonFile<any[]>(path.join(basePath, 'categories.json'));
  const categorySlugToIdMap: Record<string, string> = {};

  if (categoriesData && categoriesData.length > 0) {
    for (const catData of categoriesData) {
      const payload = { ...catData, domainId };
      const validatedCategory = createCategorySchema.parse(payload);
      
      const category = await Category.findOneAndUpdate(
        { slug: validatedCategory.slug, domainId },
        { $set: validatedCategory },
        { upsert: true, new: true }
      );
      categorySlugToIdMap[category.slug] = category._id.toString();
    }
    logger.info(`✅ Upserted ${categoriesData.length} Categories`);
  }

  // 3. Process Placards
  const placardsData = await parseJsonFile<any[]>(path.join(basePath, 'placards.json'));
  
  if (placardsData && placardsData.length > 0) {
    for (const placardData of placardsData) {
      const { categorySlug, ...rest } = placardData;
      
      const catId = categorySlugToIdMap[categorySlug];
      if (!catId) {
        logger.warn(`⚠️ Category slug '${categorySlug}' not found for placard '${rest.title}'. Skipping.`);
        continue;
      }

      const payload = { ...rest, domainId, categoryId: catId, isPublished: true };
      const validatedPlacard = createPlacardSchema.parse(payload);

      await Placard.findOneAndUpdate(
        { slug: validatedPlacard.slug || rest.slug, domainId, categoryId: catId },
        { $set: { ...validatedPlacard, createdBy: adminId } },
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ Upserted ${placardsData.length} Placards`);
  }
};

const runSeeder = async () => {
  try {
    await connectDB();
    logger.info('🌱 Starting Database Seeding Process...\n');

    const adminId = await getOrCreateSystemAdmin();

    const items = await fs.readdir(seedDataDir, { withFileTypes: true });
    const folders = items.filter(item => item.isDirectory()).map(item => item.name);

    if (folders.length === 0) {
      logger.info('📭 No seed folders found in src/seed/data');
    }

    for (const folder of folders) {
      await seedModule(folder, adminId);
    }

    logger.info('\n🎉 All Seeding Tasks Completed Successfully!');
    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Database Seeding Failed:', error);
    process.exit(1);
  }
};

// Prevent execution if not called directly
if (require.main === module) {
  runSeeder();
}