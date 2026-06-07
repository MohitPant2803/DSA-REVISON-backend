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
  const targetFolderId = "31d76c7f-e1e7-5bfd-91d5-73cd2cac99f4"; // The subfolder where the card will live
  const cardId = crypto.randomUUID(); // Fresh new ID for the card

  const cardConfig = {
    title: "Reverse a Linked List", // Card Title
    topic: "Kunnu", // Card Topic
    difficulty: "Medium", // "Easy" | "Medium" | "Hard"
    complexity: "O(N)", // Time Complexity
    tags: ["Linked Lists"],
    examples: [
      "1 -> 2 -> 3 -> nullptr ===> 3 -> 2 -> 1 -> nullptr"
    ],
    
    // Define the learning Slides array manually
    slides: [
      {
        type: "intro",
        headline: "Reverse Linked List: Snapshot",
        body: "**Problem Statement**:\nGiven the head of a singly linked list, reverse the list, and return its new head.\n\n💡 **Simplified Analogy**:\nImagine a chain of treasure hunters holding hands, pointing to the person in front. To walk backward, each hunter must turn around and point to the person behind them.",
        blocks: []
      },
      {
        type: "explanation",
        headline: "Intuition: Pointer Swapping",
        body: "🧠 **Core Intuition**:\nTo reverse, we break the link from `current` node to `next` node, and point it back to `previous` node.\n\n⚠️ **The Trap**: If we break the pointer pointing forward, we lose reference to the rest of the list! We must store the forward reference in a temporary variable (`next`) before breaking the link.",
        blocks: []
      },
      {
        type: "code",
        headline: "Code: C++ Implementation",
        body: "Observe how variable assignments shift step-by-step:",
        code: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nextTemp = curr->next; // Save next link
        curr->next = prev;              // Reverse pointer
        prev = curr;                    // Move prev up
        curr = nextTemp;                // Move curr up
    }
    return prev;
}`,
        blocks: []
      }
    ]
  };

  // Automatically extract top-level explanation and code from your slides to avoid duplication
  const introSlide = cardConfig.slides.find(s => s.type === 'intro' || s.type === 'explanation');
  const codeSlide = cardConfig.slides.find(s => s.type === 'code');

  const explanation = introSlide ? introSlide.body : "No explanation preview provided.";
  const code = codeSlide ? codeSlide.code : "";

  // Prepare slides with required slideIndex and totalSlides values for the UI
  const richSlides = cardConfig.slides.map((slide, idx) => ({
    ...slide,
    slideIndex: idx,
    totalSlides: cardConfig.slides.length,
  }));

  const cardData = {
    _id: cardId,
    title: cardConfig.title,
    topic: cardConfig.topic,
    difficulty: cardConfig.difficulty || "Medium",
    complexity: cardConfig.complexity || "",
    explanation: explanation, // Extracted dynamically
    code: code, // Extracted dynamically
    tags: cardConfig.tags || [],
    examples: cardConfig.examples || [],
    folderId: targetFolderId,
    createdBy: adminUser._id,
    visibility: "public",
    order: 0,
    isDeleted: false,
    slides: richSlides
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

  // 5. Append card ID to the parent folder's cardIds list
  const folder = await db.collection('folders').findOne({ _id: targetFolderId });
  if (folder) {
    const cardIdsList = folder.cardIds || [];
    if (!cardIdsList.includes(cardId)) {
      cardIdsList.push(cardId);
      
      await db.collection('folders').updateOne(
        { _id: targetFolderId },
        { 
          $set: { 
            cardIds: cardIdsList,
            updatedAt: new Date()
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
