require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

const mongoUri = process.env.MONGO_URI;
const MIGRATION_NAMESPACE = '7b70c22d-2019-50f6-be50-668f399fef22'; // Deterministic UUID Namespace

function parseUUID(uuidStr) {
  const hex = uuidStr.replace(/-/g, '');
  const bytes = Buffer.alloc(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function generateDeterministicUUID(input) {
  const nsBytes = parseUUID(MIGRATION_NAMESPACE);
  const nameBytes = Buffer.from(input, 'utf8');
  const totalBytes = Buffer.concat([nsBytes, nameBytes]);
  const hash = crypto.createHash('sha1').update(totalBytes).digest();
  
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant RFC4122
  
  const hex = hash.toString('hex');
  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
}

function formatBullets(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.map(item => `• ${item}`).join('\n\n');
}

function compileSlides(q) {
  const slides = [{ type: 'intro', headline: '', body: '', blocks: [] }];

  if (q.type === 'theory') {
    slides.push({ type: 'explanation', headline: '💡 Core Concept', body: formatBullets(q.bullets1), blocks: [] });
    slides.push({ type: 'explanation', headline: '💡 How it Works', body: formatBullets(q.bullets2), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Intuitive Analogy', body: formatBullets(q.bullets3), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Commonly Asked Questions', body: formatBullets(q.bullets4), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Real-world Limitations', body: formatBullets(q.bullets5), blocks: [] });
  }
  else if (q.type === 'math') {
    slides.push({ type: 'explanation', headline: '💡 Core Theorem', body: formatBullets(q.bullets1), blocks: [] });
    slides.push({ type: 'explanation', headline: '💡 Mathematical Formula', body: formatBullets(q.bullets2), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Geometric Model', body: formatBullets(q.bullets3), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Numerical Walkthrough', body: formatBullets(q.bullets4), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Commonly Asked Questions', body: formatBullets(q.bullets5), blocks: [] });
  }
  else if (q.type === 'code') {
    slides.push({ type: 'explanation', headline: '💡 Core Concept', body: formatBullets(q.bullets1), blocks: [] });
    slides.push({
      type: 'code',
      headline: q.lang === 'SQL' ? 'SQL Query' : `${q.lang} Code`, // No emoji for code titles
      body: 'Review the clean, highly optimized implementation below:',
      code: q.code || ''
    });
    slides.push({ type: 'explanation', headline: '💡 Code Breakdown', body: formatBullets(q.bullets3), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Performance Footprint', body: formatBullets(q.bullets4), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Common Interview Gotchas', body: formatBullets(q.bullets5), blocks: [] });
  }
  else if (q.type === 'comparison') {
    slides.push({ type: 'explanation', headline: `💡 ${q.conceptA}`, body: formatBullets(q.bullets1), blocks: [] });
    slides.push({ type: 'explanation', headline: `💡 ${q.conceptB}`, body: formatBullets(q.bullets2), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 The Core Tension', body: formatBullets(q.bullets3), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Comparison Matrix', body: formatBullets(q.bullets4), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Interview Scenarios', body: formatBullets(q.bullets5), blocks: [] });
  }
  else if (q.type === 'case_study') {
    slides.push({ type: 'explanation', headline: '💡 Problem Framing', body: formatBullets(q.bullets1), blocks: [] });
    slides.push({ type: 'explanation', headline: '💡 High-Level Architecture', body: formatBullets(q.bullets2), blocks: [] });
    slides.push({ type: 'explanation', headline: '💡 Core Components', body: formatBullets(q.bullets3), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Scaling & Monitoring', body: formatBullets(q.bullets4), blocks: [] });
    slides.push({ type: 'explanation', headline: '🧠 Architectural Tradeoffs', body: formatBullets(q.bullets5), blocks: [] });
  }
  return slides;
}

const CARDS_DATA = [
  ...require('./dataScienceCards/python_numpy_pandas.js'),
  ...require('./dataScienceCards/math_stats_prob.js'),
  ...require('./dataScienceCards/ml_basics.js'),
  ...require('./dataScienceCards/advanced_ml_dl.js'),
  ...require('./dataScienceCards/transformers_nlp_recsys.js'),
  ...require('./dataScienceCards/sql_cases_interview.js')
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Get system admin user
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
  }
  const adminId = admin._id;

  // Formatting rules regex configuration
  const replacements = [
    { pattern: /\bSingle Point of Failure\b/g, replacement: '**Single Point of Failure**' },
    { pattern: /\bsingle point of failure\b/g, replacement: '**single point of failure**' },
    { pattern: /\bp99 latency\b/g, replacement: '`p99 latency`' },
    { pattern: /\bP99 latency\b/g, replacement: '`P99 latency`' },
    { pattern: /\bconsistent hashing\b/g, replacement: '**consistent hashing**' },
    { pattern: /\bConsistent Hashing\b/g, replacement: '**Consistent Hashing**' },
    { pattern: /\bRound Robin\b/g, replacement: '**Round Robin**' },
    { pattern: /\bround robin\b/g, replacement: '**round robin**' },
    { pattern: /\bLeast Connections\b/g, replacement: '**Least Connections**' },
    { pattern: /\bleast connections\b/g, replacement: '**least connections**' },
    { pattern: /\bToken Bucket\b/g, replacement: '**Token Bucket**' },
    { pattern: /\btoken bucket\b/g, replacement: '**token bucket**' },
    { pattern: /\bLeaky Bucket\b/g, replacement: '**Leaky Bucket**' },
    { pattern: /\bleaky bucket\b/g, replacement: '**leaky bucket**' },
    { pattern: /\bFixed Window\b/g, replacement: '**Fixed Window**' },
    { pattern: /\bfixed window\b/g, replacement: '**fixed window**' },
    { pattern: /\bSliding Window\b/g, replacement: '**Sliding Window**' },
    { pattern: /\bsliding window\b/g, replacement: '**sliding window**' },
    { pattern: /\bhorizontal scaling\b/g, replacement: '**horizontal scaling**' },
    { pattern: /\bHorizontal scaling\b/g, replacement: '**Horizontal scaling**' },
    { pattern: /\bHorizontal Scaling\b/g, replacement: '**Horizontal Scaling**' },
    { pattern: /\bvertical scaling\b/g, replacement: '**vertical scaling**' },
    { pattern: /\bVertical scaling\b/g, replacement: '**Vertical scaling**' },
    { pattern: /\bVertical Scaling\b/g, replacement: '**Vertical Scaling**' },
    { pattern: /\brate limiting\b/g, replacement: '**rate limiting**' },
    { pattern: /\bRate Limiting\b/g, replacement: '**Rate Limiting**' },
    { pattern: /\bload balancer\b/g, replacement: '**load balancer**' },
    { pattern: /\bLoad Balancer\b/g, replacement: '**Load Balancer**' },
    { pattern: /\bload balancing\b/g, replacement: '**load balancing**' },
    { pattern: /\bLoad Balancing\b/g, replacement: '**Load Balancing**' },
    { pattern: /\bfunctional requirements\b/g, replacement: '**functional requirements**' },
    { pattern: /\bFunctional Requirements\b/g, replacement: '**Functional Requirements**' },
    { pattern: /\bnon-functional requirements\b/g, replacement: '**non-functional requirements**' },
    { pattern: /\bNon-Functional Requirements\b/g, replacement: '**Non-Functional Requirements**' },
    { pattern: /\bNon-functional Requirements\b/g, replacement: '**Non-functional Requirements**' },
    { pattern: /\bSLA\/SLO\b/g, replacement: '`SLA/SLO`' },

    { pattern: /\bSPOF\b/g, replacement: '**SPOF**' },
    { pattern: /\blatency\b/g, replacement: '**latency**' },
    { pattern: /\bLatency\b/g, replacement: '**Latency**' },
    { pattern: /\bthroughput\b/g, replacement: '**throughput**' },
    { pattern: /\bThroughput\b/g, replacement: '**Throughput**' },
    { pattern: /\bavailability\b/g, replacement: '**availability**' },
    { pattern: /\bAvailability\b/g, replacement: '**Availability**' },
    { pattern: /\bconsistency\b/g, replacement: '**consistency**' },
    { pattern: /\bConsistency\b/g, replacement: '**Consistency**' },
    { pattern: /\bsharding\b/g, replacement: '**sharding**' },
    { pattern: /\bSharding\b/g, replacement: '**Sharding**' },
    { pattern: /\breplication\b/g, replacement: '**replication**' },
    { pattern: /\bReplication\b/g, replacement: '**Replication**' },
    { pattern: /\bcaching\b/g, replacement: '**caching**' },
    { pattern: /\bCaching\b/g, replacement: '**Caching**' },
    { pattern: /\bheartbeat\b/g, replacement: '**heartbeat**' },
    { pattern: /\bHeartbeat\b/g, replacement: '**Heartbeat**' },

    { pattern: /\bCAP\b/g, replacement: '`CAP`' },
    { pattern: /\bACID\b/g, replacement: '`ACID`' },
    { pattern: /\bHTTP 302\b/g, replacement: '`HTTP 302`' },
    { pattern: /\bCache-Control\b/g, replacement: '`Cache-Control`' },
    { pattern: /\bmax-age\b/g, replacement: '`max-age`' },
    { pattern: /\bNoSQL\b/g, replacement: '`NoSQL`' },
    { pattern: /\bSQL\b/g, replacement: '`SQL`' },
    { pattern: /\bRedis\b/g, replacement: '`Redis`' },
    { pattern: /\bCassandra\b/g, replacement: '`Cassandra`' },
    { pattern: /\bMongoDB\b/g, replacement: '`MongoDB`' },
    { pattern: /\bMySQL\b/g, replacement: '`MySQL`' },
    { pattern: /\bPostgreSQL\b/g, replacement: '`PostgreSQL`' },
    { pattern: /\bKafka\b/g, replacement: '`Kafka`' },
    { pattern: /\bRabbitMQ\b/g, replacement: '`RabbitMQ`' },
    { pattern: /\bZooKeeper\b/g, replacement: '`ZooKeeper`' },
    { pattern: /\bDynamoDB\b/g, replacement: '`DynamoDB`' },
    { pattern: /\bHBase\b/g, replacement: '`HBase`' },
    { pattern: /\bS3\b/g, replacement: '`S3`' },
    { pattern: /\bHLS\b/g, replacement: '`HLS`' },
    { pattern: /\bCDN\b/g, replacement: '`CDN`' },
    { pattern: /\bFCM\b/g, replacement: '`FCM`' },
    { pattern: /\bAPNS\b/g, replacement: '`APNS`' },
    { pattern: /\bTwilio\b/g, replacement: '`Twilio`' },
    { pattern: /\bSendGrid\b/g, replacement: '`SendGrid`' },
    { pattern: /\bElasticsearch\b/g, replacement: '`Elasticsearch`' },
    { pattern: /\bBase62\b/g, replacement: '`Base62`' },
    { pattern: /\bMD5\b/g, replacement: '`MD5`' },
    { pattern: /\bSHA-256\b/g, replacement: '`SHA-256`' },
    { pattern: /\bTCP\b/g, replacement: '`TCP`' },
    { pattern: /\bUDP\b/g, replacement: '`UDP`' },
    { pattern: /\bHTTP\b/g, replacement: '`HTTP`' },
    { pattern: /\bHTTPS\b/g, replacement: '`HTTPS`' },
    { pattern: /\bWebSockets\b/g, replacement: '`WebSockets`' },
    { pattern: /\bSSE\b/g, replacement: '`SSE`' },
    { pattern: /\bS2\b/g, replacement: '`S2`' },
    { pattern: /\bH3\b/g, replacement: '`H3`' },
    { pattern: /\bSLA\b/g, replacement: '`SLA`' },
    { pattern: /\bSLO\b/g, replacement: '`SLO`' },
  ];

  function formatText(text) {
    if (typeof text !== 'string') return text;
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        let segment = parts[i];
        for (const r of replacements) {
          segment = segment.replace(r.pattern, r.replacement);
        }
        segment = segment.replace(/^(Definition|Examples|Student Shorthand|Pro|Con|Pros|Cons|Q|A|Mechanism|Tension|Indicator|Rule|Difference|Utility|Indicator|Sparsity|Weight Shrinkage| interpretability|Goal|Consequence|Types|Step \d|Analogy|Limitation):/, '**$1**:');
        parts[i] = segment;
      }
    }
    return parts.join('');
  }

  console.log(`\n--- Seeding ${CARDS_DATA.length} Data Science & AI Cards ---`);
  const folderCardIdsMap = {};

  for (const q of CARDS_DATA) {
    const cardId = generateDeterministicUUID(`${q.topic}-${q.title}`);

    // Format bullets before building slides
    const bulletKeys = ['bullets1', 'bullets2', 'bullets3', 'bullets4', 'bullets5'];
    for (const key of bulletKeys) {
      if (Array.isArray(q[key])) {
        q[key] = q[key].map(bullet => formatText(bullet));
      }
    }

    const slides = compileSlides(q);

    if (!folderCardIdsMap[q.folderId]) {
      folderCardIdsMap[q.folderId] = [];
    }
    folderCardIdsMap[q.folderId].push(cardId);

    // Delete existing card to ensure fresh update
    await db.collection('revisioncards').deleteOne({ _id: cardId });

    // Determine card level explanation
    let cardExplanation = '';
    if (q.type === 'comparison') {
      cardExplanation = `Comparison: ${q.conceptA} vs ${q.conceptB}`;
    } else if (q.type === 'code') {
      cardExplanation = q.bullets1 ? q.bullets1.join('\n\n') : '';
    } else {
      cardExplanation = q.bullets1 ? q.bullets1.join('\n\n') : '';
    }

    const newCard = {
      _id: cardId,
      title: q.title,
      topic: q.topic,
      difficulty: q.difficulty,
      complexity: q.complexity || '',
      explanation: formatText(cardExplanation),
      folderId: q.folderId,
      createdBy: adminId,
      visibility: 'public',
      order: 0,
      isDeleted: false,
      slides: slides,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('revisioncards').insertOne(newCard);
    console.log(`✅ Seeded Card: "${q.title}" | ID: ${cardId}`);
  }

  // 2. Associate cardIds inside folders collection
  console.log('\n--- Updating Folder Card References ---');
  for (const folderId of Object.keys(folderCardIdsMap)) {
    const cardIdsList = folderCardIdsMap[folderId];
    await db.collection('folders').updateOne(
      { _id: folderId },
      { $set: { cardIds: cardIdsList, updatedAt: new Date() } }
    );
    console.log(`✅ Updated Folder ${folderId} with ${cardIdsList.length} cards.`);
  }

  // 3. Write deletion tombstones for all registered users in deletedentities
  console.log('\n--- Creating Deletion Tombstones for Existing Users ---');
  const allUsers = await db.collection('users').find({}).toArray();
  console.log(`Found ${allUsers.length} users in the database.`);

  let tombstonesCount = 0;
  for (const user of allUsers) {
    const userId = user._id;
    const startRevision = user.currentRevision || 0;
    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { currentRevision: startRevision + 1 } }
    );
    tombstonesCount++;
  }
  console.log(`✅ Completed writing ${tombstonesCount} user revisions updates.`);

  await mongoose.disconnect();
  console.log('\nCard seeding completed successfully.');
}

run().catch(console.error);
