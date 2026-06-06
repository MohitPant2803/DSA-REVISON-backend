import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProcessedMutation from '../models/processedMutation.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsa_revision';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected successfully!');

  const result = await ProcessedMutation.deleteMany({});
  console.log(`Deleted ${result.deletedCount} ProcessedMutation documents.`);

  await mongoose.disconnect();
  console.log('Disconnected.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
