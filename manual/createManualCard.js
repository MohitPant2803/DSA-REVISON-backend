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
    title:"Estimate the Number of Instagram Users in India as of 2025 r", // Card Title
    topic: "Guesstimates", // Card Topic
    difficulty: "Easy ", // "Easy" | "Medium" | "Hard"
    complexity: "", // Time Complexity
    explanation: "**Problem Statement**:\nEstimate the `number of Instagram users in India as of 2025`.\n\n💡 **Simplified Analogy**:\nInstead of directly guessing the number of Instagram users, we first estimate how many people have internet access and then determine Instagram adoption across different age groups.",  
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
        Body: "**Mental Model: Internet Users × Social Media Adoption**\n\nInstagram users can be estimated by:\n\n1. Estimating India's population.\n2. Determining the percentage with `internet access`.\n3. Segmenting the population by `age groups`.\n4. Estimating Instagram penetration within each age group.\n\nAdding users across all age groups gives the final estimate.",   
        blocks: []
      },
      {
        type: "explanation",
        headline: "🧠 Core Intuition & Approach",
        body:"**Core Intuition**:\nNot everyone in the population can be considered an Instagram user. The first filter is `internet access`, since Instagram requires internet connectivity.\nThe internet-enabled population can then be segmented into different `age groups`, each having a different likelihood of using Instagram. Teenagers and young adults are typically more active on social media, while children and older adults have lower adoption rates.\nBy estimating Instagram penetration across each age group and combining their contributions, we can estimate the total number of Instagram users in India.",  
        blocks: []
      },
      {
        type: "explanation",
headline: "⚠️ The Trap vs The Clean Way",
body: "❌ **Common Trap**:\nAssuming a random percentage of India's population uses Instagram.\n\n✅ **Preferred Approach**:\nFirst estimate the `internet-enabled population`, then apply age-wise Instagram penetration rates.",
blocks: [] 
      },
      {
type: "dryrun",
headline: "🔍 Dry Run Trace",
body: "",
steps:[
"**Step 1:** Start with `India's Population = 150 Crore`.\n\nAssume that only `60%` of the population has internet access, giving an internet-enabled population of `90 Crore`.",
"**Step 2:** Divide the population into age groups:\n\n• `0–14 Years = 20%`\n• `14–18 Years = 15%`\n• `18–50 Years = 50%`\n• `50+ Years = 15%`."
], 
blocks: [] 
   },
  {
type: "dryrun",
headline: "🔍 Dry Run Trace",
body: "",
steps:[
  "**Step 3:** Estimate Instagram adoption within each age group:\n\n• `0–14 Years → 20%`\n• `14–18 Years → 80%`\n• `18–50 Years → 95%`\n• `50+ Years → 40%`.",
"**Step 4:** Compute the weighted Instagram penetration:\n\n`(0.2×0.2 + 0.15×0.8 + 0.5×0.95 + 0.15×0.4) = 0.695`."
], 
blocks: [] 
   },
   {
type: "dryrun",
headline: "🔍 Dry Run Trace",
body: "",
steps:[
"**Step 5:** Multiply the weighted penetration by the internet-enabled population:\n\n`150 × 0.6 × 0.695 ≈ 63 Crore Users`.",
"**Step 6:** Therefore, the estimated number of Instagram users in India is approximately `63 Crore`."
], 
blocks: [] 
   },
   {
type: "explanation",
headline: "📊 Assumptions Used",
body: "**Population**\n\n• `India Population = 150 Crore`\n• `Internet Access = 60%`\n• `No Internet Access = 40%`\n\n**Age Distribution**\n\n• `0–14 Years = 20%`\n• `14–18 Years = 15%`\n• `18–50 Years = 50%`\n• `50+ Years = 15%`",
blocks: []
}, 
{
type: "explanation",
headline: "👶 Age Group 0–14 Years",
body: "Most children in this age group do not own personal smartphones.\n\nAssume only `20%` of this age group actively uses Instagram.\n\nInstagram Penetration = `20%`.",
blocks: []
}, 
{
type: "explanation",
headline: "🧑‍🎓 Age Group 14–18 Years",
body: "Teenagers are among the most active social media users.\n\nAssume approximately `80%` of this age group has an Instagram account.\n\nInstagram Penetration = `80%`.",
blocks: []
}, 
{
type: "explanation",
headline: "👨‍💼 Age Group 18–50 Years",
body: "This segment includes students, professionals, homemakers, and digitally connected adults.\n\nAssume approximately `95%` of internet users in this segment use Instagram.\n\nInstagram Penetration = `95%`.",
blocks: []
},
{
type: "explanation",
headline: "👴 Age Group 50+ Years",
body: "Older adults are comparatively less active on social media.\n\nAssume around `40%` of this age group uses Instagram.\n\nInstagram Penetration = `40%`.",
blocks: []
}, 
{
type: "explanation",
headline: "🧮 Calculation",
body: "`Total Instagram Users = 150 Cr × 0.6 × (0.2×0.2 + 0.15×0.8 + 0.5×0.95 + 0.15×0.4)`\n\n`= 150 Cr × 0.6 × 0.695`\n\n`≈ 63 Crore Users`",
blocks: []
},
{
type: "explanation",
headline: "✅ Final Estimate",
body: "🎯 **Estimated Instagram Users in India (2025)**\n\n`≈ 63 Crore Users`\n\nThis estimate is based on:\n\n• `India Population`\n• `Internet Penetration`\n• `Age Distribution`\n• `Instagram Adoption Across Age Groups`",
blocks: []
}
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
