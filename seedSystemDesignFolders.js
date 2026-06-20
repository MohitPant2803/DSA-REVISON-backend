require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;
const SYSTEM_DESIGN_PARENT_ID = '81d530e3-d883-5ee2-a8d9-6c4e6435f143';

const SUBFOLDERS = [
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f144',
    title: 'System Design Fundamentals',
    description: 'Core concepts: functional & non-functional requirements, latency, throughput, availability, reliability, and capacity estimation.',
    icon: 'sliders',
    color: '#3B82F6',
    order: 1
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f145',
    title: 'Scalability Basics',
    description: 'Scaling strategies: vertical vs. horizontal scaling, stateful vs. stateless server designs, and bottleneck analysis.',
    icon: 'trending-up',
    color: '#10B981',
    order: 2
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f146',
    title: 'Load Balancing',
    description: 'Distributing traffic: L4 vs. L7 load balancers, algorithms (Round Robin, Least Connections), and Consistent Hashing.',
    icon: 'shuffle',
    color: '#F59E0B',
    order: 3
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f147',
    title: 'Caching',
    description: 'Accelerating data access: Cache Aside, Write Through, Write Back, TTL, cache invalidation strategies, and Redis.',
    icon: 'zap',
    color: '#EC4899',
    order: 4
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f148',
    title: 'Databases',
    description: 'Choosing the right storage: SQL vs. NoSQL (Document, Key-Value, Columnar Stores), database indexing, and ACID properties.',
    icon: 'database',
    color: '#8B5CF6',
    order: 5
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f149',
    title: 'Database Scaling',
    description: 'Scaling database layers: Replication models (Leader-follower), Sharding, Partitioning, and Read Replicas.',
    icon: 'layers',
    color: '#06B6D4',
    order: 6
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f150',
    title: 'CAP Theorem',
    description: 'Distributed trade-offs: Consistency, Availability, Partition Tolerance, and choosing CP vs. AP systems.',
    icon: 'git-commit',
    color: '#F97316',
    order: 7
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f151',
    title: 'Consistency Models',
    description: 'Data consistency models: Strong consistency, Eventual consistency, Read-Your-Writes, and Quorum reads/writes.',
    icon: 'lock',
    color: '#EAB308',
    order: 8
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f152',
    title: 'Messaging Queues',
    description: 'Asynchronous messaging: Producer-Consumer queues, Kafka, RabbitMQ, retry mechanisms, and Dead Letter Queues.',
    icon: 'activity',
    color: '#EF4444',
    order: 9
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f153',
    title: 'Distributed Systems Basics',
    description: 'Foundational trade-offs: SPOFs, distributed consensus algorithms, leader elections, and clock synchronization.',
    icon: 'git-branch',
    color: '#14B8A6',
    order: 10
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f154',
    title: 'Microservices',
    description: 'Decomposing monoliths: Service Discovery, API Gateway patterns, microservices trade-offs, and service communication.',
    icon: 'grid',
    color: '#6366F1',
    order: 11
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f155',
    title: 'API Design',
    description: 'Designing endpoints: REST basics, HTTP methods, idempotency, pagination, versioning, and API rate limiting.',
    icon: 'terminal',
    color: '#A855F7',
    order: 12
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f156',
    title: 'Storage Systems',
    description: 'Choosing media: Blob storage, Object storage, File storage, Block storage, and Distributed File Systems.',
    icon: 'hard-drive',
    color: '#E11D48',
    order: 13
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f157',
    title: 'Search Systems',
    description: 'Information retrieval: Inverted indexes, full-text search systems, Elasticsearch, and document ranking concepts.',
    icon: 'search',
    color: '#059669',
    order: 14
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f158',
    title: 'CDN',
    description: 'Edge distribution: CDNs, edge servers, cache distribution mechanisms, request flows, and latency reduction.',
    icon: 'globe',
    color: '#2563EB',
    order: 15
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f159',
    title: 'Rate Limiting',
    description: 'Protecting services: Token Bucket, Leaky Bucket, Fixed/Sliding Window algorithms, and traffic limiting tradeoffs.',
    icon: 'hourglass',
    color: '#D946EF',
    order: 16
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f160',
    title: 'Real-Time Systems',
    description: 'Real-time communication: Polling, Long polling, Server-Sent Events (SSE), and WebSockets.',
    icon: 'radio',
    color: '#F43F5E',
    order: 17
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f161',
    title: 'Reliability & Fault Tolerance',
    description: 'Ensuring resilience: Redundancy, auto-failover, disaster recovery, and high availability systems.',
    icon: 'check-circle',
    color: '#10B981',
    order: 18
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f162',
    title: 'Observability',
    description: 'System transparency: Logging, metrics, monitoring, distributed tracing, and alerting strategies.',
    icon: 'eye',
    color: '#F59E0B',
    order: 19
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f163',
    title: 'Security Basics',
    description: 'Securing architectures: Authentication vs. Authorization, JWTs, OAuth, encryption, and HTTPS.',
    icon: 'key',
    color: '#64748B',
    order: 20
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f164',
    title: 'Design Popular Systems',
    description: 'High-level designs: TinyURL, Instagram feed, WhatsApp, Uber, YouTube, Dropbox, and Notification System.',
    icon: 'award',
    color: '#4F46E5',
    order: 21
  },
  {
    _id: '81d530e3-d883-5ee2-a8d9-6c4e6435f165',
    title: 'Most Asked Interview Questions',
    description: 'Comparison frameworks: SQL vs. NoSQL, Sharding vs. Partitioning, Kafka vs. RabbitMQ, and CAP tradeoffs.',
    icon: 'help-circle',
    color: '#0891B2',
    order: 22
  }
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Get system admin user
  let admin = await db.collection('users').findOne({ email: 'system@admin.com' });
  if (!admin) {
    console.log('👤 Admin user system@admin.com not found, creating it...');
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
  }
  const adminId = admin._id;

  // 2. Verify root folder exists
  const rootFolder = await db.collection('folders').findOne({ _id: SYSTEM_DESIGN_PARENT_ID });
  if (!rootFolder) {
    console.log(`📂 Root System Design folder not found! Creating parent folder...`);
    await db.collection('folders').insertOne({
      _id: SYSTEM_DESIGN_PARENT_ID,
      title: 'System Design',
      description: 'Understand high-level system architecture, scalability, microservices, and system design patterns.',
      icon: 'git-branch',
      color: '#EC4899',
      createdBy: adminId,
      visibility: 'public',
      roleAccess: ['user', 'admin', 'superadmin'],
      order: 4, // placement order
      parentFolderId: null,
      cardIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  console.log('\n--- Seeding 22 System Design Child Folders ---');
  for (const sub of SUBFOLDERS) {
    // Delete if existing to guarantee clean updates
    await db.collection('folders').deleteOne({ _id: sub._id });

    const newSubfolder = {
      _id: sub._id,
      title: sub.title,
      description: sub.description,
      icon: sub.icon,
      color: sub.color,
      createdBy: adminId,
      visibility: 'public',
      roleAccess: ['user', 'admin', 'superadmin'],
      order: sub.order,
      parentFolderId: SYSTEM_DESIGN_PARENT_ID,
      cardIds: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('folders').insertOne(newSubfolder);
    console.log(`✅ Seeded Subfolder: "${sub.title}" | ID: ${sub._id}`);
  }

  await mongoose.disconnect();
  console.log('\nFolder seeding finished.');
}

run().catch(console.error);
