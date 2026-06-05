import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { logger } from '../utils/logger';
import User from '../models/user.model';

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

const runSeeder = async () => {
  try {
    await connectDB();
    logger.info('🌱 Starting Database Seeding Process...\n');

    const adminId = await getOrCreateSystemAdmin();

    logger.info('\n🎉 Seeding Completed (System Admin Verified)!');
    process.exit(0);
  } catch (error: any) {
    logger.error('❌ Database Seeding Failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeeder();
}