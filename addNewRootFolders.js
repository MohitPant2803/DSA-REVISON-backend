require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

const FOLDERS_TO_ADD = [
  {
    title: 'Operating Systems',
    description: 'Master core OS concepts: processes, threads, memory management, and file systems.',
    icon: 'cpu',
    color: '#3B82F6', // Vibrant Blue
    order: 1,
  },
  {
    title: 'Computer Networks',
    description: 'Explore TCP/IP, OSI layers, protocols, routing, and network security basics.',
    icon: 'globe',
    color: '#06B6D4', // Cool Cyan
    order: 2,
  },
  {
    title: 'DBMS',
    description: 'Learn relational database systems, SQL, normalization, indexing, and transactions.',
    icon: 'database',
    color: '#10B981', // Emerald Green
    order: 3,
  },
  {
    title: 'System Design',
    description: 'Understand high-level system architecture, scalability, microservices, and system design patterns.',
    icon: 'git-branch',
    color: '#EC4899', // Pink
    order: 4,
  },
  {
    title: 'Quant',
    description: 'Handpicked conceptual brain teasers, logical puzzles, and quantitative challenges.',
    icon: 'brain',
    color: '#8B5CF6', // Purple
    order: 5,
  },
  {
    title: 'Guesstimates',
    description: 'Develop structured estimating frameworks for sizing markets and resource usage.',
    icon: 'calculator',
    color: '#F59E0B', // Amber
    order: 6,
  },
  {
    title: 'Case Studies',
    description: 'Real-world business and product case studies analyzing growth, architecture, and engineering strategies.',
    icon: 'book-open',
    color: '#EF4444', // Red
    order: 7,
  }
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;

  // 1. Get or create system admin user
  let admin = await db.collection('users').findOne({ email: 'system@admin.com' });
  if (!admin) {
    const result = await db.collection('users').insertOne({
      name: 'System Auto-Seeder',
      email: 'system@admin.com',
      role: 'superadmin',
      authProvider: 'system',
      streakCount: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    admin = { _id: result.insertedId };
    console.log('👤 Created System Admin User');
  }
  const adminId = admin._id;

  console.log('\n--- Adding New Root Folders ---');
  for (const f of FOLDERS_TO_ADD) {
    // Check if the folder already exists at root level
    const existing = await db.collection('folders').findOne({
      title: f.title,
      parentFolderId: null
    });

    if (existing) {
      console.log(`⚠️ Folder "${f.title}" already exists at root level. Skipping.`);
    } else {
      const newFolder = {
        title: f.title,
        description: f.description,
        icon: f.icon,
        color: f.color,
        createdBy: adminId,
        visibility: 'public',
        roleAccess: ['user', 'admin', 'superadmin'],
        order: f.order,
        parentFolderId: null,
        cardIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const res = await db.collection('folders').insertOne(newFolder);
      console.log(`✅ Created Folder "${f.title}" with ID: ${res.insertedId}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
