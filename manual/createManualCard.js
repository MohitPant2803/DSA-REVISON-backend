require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

// Helper function to walk folder path and get metadata
async function resolveFolderMetadata(folderId, db) {
  const subfolderIds = [];
  const titles = [];
  let tempFolder = await db.collection('folders').findOne({ _id: folderId });
  
  if (!tempFolder) {
    throw new Error(`Folder with ID ${folderId} not found.`);
  }

  while (tempFolder) {
    subfolderIds.unshift(tempFolder._id);
    titles.unshift(tempFolder.title);
    if (tempFolder.parentFolderId) {
      tempFolder = await db.collection('folders').findOne({ _id: tempFolder.parentFolderId });
    } else {
      break;
    }
  }

  return {
    rootFolderId: subfolderIds[0],
    rootFolderName: titles[0],
    subfolderPath: '/' + titles.join('/'),
    subfolderIds,
  };
}

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing from your .env file!');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');

  const db = mongoose.connection.db;

  // 1. Fetch system admin ID
  const adminUser = await db.collection('users').findOne({ email: 'system@admin.com' });
  if (!adminUser) {
    throw new Error('System admin user not found. Please run npm run seed:dsa first.');
  }

  // ==========================================
  // CONFIGURATION: Set card details and slides
  // ==========================================
  const targetFolderId = "8fa92a37-80a0-5390-921d-d62d70236187"; // The subfolder where the card will live
  const cardId = crypto.randomUUID(); // Fresh new ID for the card

const cardData = {
    _id: cardId,
    title: "Routers Sold in India Per Year", // Card Title
    topic: "Guesstimates", // Card Topic
    difficulty: "Medium", // "Easy" | "Medium" | "Hard"
    complexity: "", // Time Complexity
    explanation: "**Problem Statement**:\nEstimate the number of routers sold in India per year.\n\n💡 **Simplified Analogy**:\nImagine routers like internet entry points. Homes, offices, banks, cafes, restaurants, and malls need them, so we estimate demand segment-wise and adjust for router lifespan.",
    folderId: targetFolderId, // Automatically matches the target folder
    createdBy: adminUser._id,
    visibility: "public",
    order: 0, // Card sorting weight
    isDeleted: false,
    
    // 2. Define the learning Slides array manually (Template containing all slide types)
    slides: [
      {
        type: "intro",
        headline: "",
        body: "",
        blocks: []
      },
      {
        type: "explanation",
        headline: "💡 The Mental Model",
        body: "**Clarifications & Scope**:\n1. We estimate routers sold in India in one year.\n2. Buyers include households, offices, banks, restaurants, cafes, and malls.\n3. Since routers last multiple years, total router demand is divided by average router life.",
        blocks: []
      },
      {
        type: "explanation",
        headline: "🧠 Core Intuition & Approach",
        body: "**Intuition: Segment-Based Replacement Estimation**:\nInstead of guessing router sales directly, we estimate router ownership across major user segments. Then we divide by average router life to get yearly sales.\n`Annual Router Sales = Total Routers ÷ Router Life`",
        blocks: []
      },
      {
        type: "explanation",
        headline: "Assumptions",
        body: " **User Segments:**\nAverage router life = `5 years`.\nHouseholds = `37.5 Cr`.\nOnly upper-income households, around `30%`, are assumed to buy routers.\nOffices and banks need around `20 routers` each.\nRestaurants, cafes, and malls are also included.",
        blocks: []
      },
      {
        type: "dryrun",
        headline: "🧮Numerical Estimation",
        body: "`",
        steps: [
 "**Step 1: Households:**\nTotal households = `37.5 Cr`\nRouter-owning households = `30%`\nAverage router life = `5 years`\nCalculation:\n`37.5 × 30% ÷ 5`\n= **2.25 Cr routers/year**",
"**Step 2: Offices and Banks:**\nOffices = `30 lakh`\nBanks = `40 lakh`\nRouters per office/bank = `20`\nAverage life = `5 years`\nCalculation:\n`(30L + 40L) × 20 ÷ 5`\n= **2.8 Cr routers/year**"
],
blocks: []
    },
    {
        type: "dryrun",
        headline: "🧮Numerical Estimation",
        body: "`",
        steps: [
"**Step 3: Restaurants, Cafes and Malls:**\nMalls = `5000`, with `100 routers` each\nRestaurants + cafes = `1.5 Cr`, with `40%` router usage\nAverage life = `5 years`\nCalculation:\n`(5000×100 + 1.5Cr×40%) ÷ 5`\n≈ **0.13 Cr routers/year**",
"**Step 4: Final Total:**\nHouseholds = `2.25 Cr`\nOffices and banks = `2.8 Cr`\nRestaurants, cafes and malls = `0.13 Cr`\nTotal = `2.25 + 2.8 + 0.13`\n= **5.18 Cr routers/year**"
        ],
        blocks: []
      },
    ]
  };



  // 3. Resolve path metadata from the folderId
  console.log(`Resolving folder pathing metadata for folder: "${targetFolderId}"`);
  const pathMetadata = await resolveFolderMetadata(targetFolderId, db);
  
  // Merge path details into card payload
  const finalCardPayload = {
    ...cardData,
    ...pathMetadata,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // 4. Save the Card document to the database
  await db.collection('revisioncards').insertOne(finalCardPayload);
  console.log(`✅ Saved card document: "${cardData.title}" (${cardId})`);

  // 5. Append card ID to the parent folder's cardIds list (For sorting and containment)
  const folder = await db.collection('folders').findOne({ _id: targetFolderId });
  if (folder) {
    const cardIdsList = folder.cardIds || [];
    if (!cardIdsList.includes(cardId)) {
      cardIdsList.push(cardId); // Add card ID to list (puts it at the end of the folder)
      
      await db.collection('folders').updateOne(
        { _id: targetFolderId },
        { 
          $set: { 
            cardIds: cardIdsList,
            updatedAt: new Date() // Bumps updatedAt to trigger folder re-sync
          } 
        }
      );
      console.log(`✅ Appended card ID to parent folder's cardIds array.`);
    }
  }

  await mongoose.disconnect();
  console.log('Disconnected.');
}

run().catch(console.error);
