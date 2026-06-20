require('dotenv').config();
const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const mongoUri = process.env.MONGO_URI;
const OS_PARENT_ID = 'f4944c6e-f81a-52d5-ac46-c2d04056462e';

const SUBFOLDERS = [
  {
    title: 'OS Basics',
    description: 'Quick revision of OS fundamentals, User vs Kernel mode, system calls, and microkernels.',
    icon: 'cpu',
    color: '#3B82F6',
    order: 1
  },
  {
    title: 'Processes',
    description: 'Revision cards covering processes, PCB, process states, and zombie/orphan/daemon processes.',
    icon: 'git-branch',
    color: '#3B82F6',
    order: 2
  },
  {
    title: 'Threads',
    description: 'Key differences between processes and threads, multithreading, and lifecycle.',
    icon: 'layers',
    color: '#3B82F6',
    order: 3
  },
  {
    title: 'CPU Scheduling',
    description: 'FCFS, SJF, SRTF, Round Robin scheduling algorithms and numericals.',
    icon: 'activity',
    color: '#3B82F6',
    order: 4
  },
  {
    title: 'Process Synchronization',
    description: 'Critical section, Mutex, Semaphores, Monitors, and classical problems.',
    icon: 'lock',
    color: '#3B82F6',
    order: 5
  },
  {
    title: 'Deadlocks',
    description: 'Necessary conditions, RAG, Deadlock prevention, detection, avoidance (Banker\'s).',
    icon: 'slash',
    color: '#3B82F6',
    order: 6
  },
  {
    title: 'Memory Management',
    description: 'Logical vs physical address space, address binding, and fragmentation.',
    icon: 'database',
    color: '#3B82F6',
    order: 7
  },
  {
    title: 'Paging',
    description: 'Paging basics, page tables, TLB lookup, and page access time calculations.',
    icon: 'columns',
    color: '#3B82F6',
    order: 8
  },
  {
    title: 'Segmentation',
    description: 'Segmentation basics, segment tables, and paging vs segmentation.',
    icon: 'layout',
    color: '#3B82F6',
    order: 9
  },
  {
    title: 'Virtual Memory',
    description: 'Virtual memory concept, demand paging, thrashing, and copy-on-write.',
    icon: 'cloud',
    color: '#3B82F6',
    order: 10
  },
  {
    title: 'Page Replacement',
    description: 'FIFO, LRU, Optimal algorithms, Belady\'s anomaly, and numerical calculations.',
    icon: 'refresh-cw',
    color: '#3B82F6',
    order: 11
  },
  {
    title: 'File Systems',
    description: 'File concepts, directory structures, allocation methods, and free space management.',
    icon: 'folder',
    color: '#3B82F6',
    order: 12
  },
  {
    title: 'Disk Scheduling',
    description: 'Disk scheduling algorithms (FCFS, SSTF, SCAN, LOOK, C-SCAN) and numericals.',
    icon: 'disc',
    color: '#3B82F6',
    order: 13
  },
  {
    title: 'IPC',
    description: 'Inter-Process Communication mechanisms: shared memory, pipes, message queues, sockets.',
    icon: 'radio',
    color: '#3B82F6',
    order: 14
  },
  {
    title: 'Linux for Interviews',
    description: 'Important system calls (fork, exec, wait, pipe) and Linux interview commands.',
    icon: 'terminal',
    color: '#3B82F6',
    order: 15
  },
  {
    title: 'Most Asked Interview Questions',
    description: 'Top OS comparison questions and high-frequency interview concepts.',
    icon: 'help-circle',
    color: '#3B82F6',
    order: 16
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

  // 2. Verify root folder exists
  const rootOSFolder = await db.collection('folders').findOne({ _id: OS_PARENT_ID });
  if (!rootOSFolder) {
    console.error(`❌ Root folder "Operating Systems" with ID ${OS_PARENT_ID} not found in database!`);
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`📂 Found Root Folder: "${rootOSFolder.title}"`);

  console.log('\n--- Creating 16 Child Subfolders ---');
  for (const sub of SUBFOLDERS) {
    // Check if subfolder already exists under the OS folder
    const existing = await db.collection('folders').findOne({
      title: sub.title,
      parentFolderId: OS_PARENT_ID
    });

    if (existing) {
      console.log(`⚠️ Subfolder "${sub.title}" already exists under OS. ID: ${existing._id}`);
    } else {
      const folderId = randomUUID();
      const newSubfolder = {
        _id: folderId,
        title: sub.title,
        description: sub.description,
        icon: sub.icon,
        color: sub.color,
        createdBy: adminId,
        visibility: 'public',
        roleAccess: ['user', 'admin', 'superadmin'],
        order: sub.order,
        parentFolderId: OS_PARENT_ID,
        cardIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.collection('folders').insertOne(newSubfolder);
      console.log(`✅ Created Subfolder: "${sub.title}" | ID: ${folderId}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDisconnected.');
}

run().catch(console.error);
