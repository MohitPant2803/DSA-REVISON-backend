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
  const targetFolderId = "d3f0c187-44fc-459d-83fb-17989c23ff9f"; // The subfolder where the card will live
  const cardId = crypto.randomUUID(); // Fresh new ID for the card

const cardData = {
    _id: cardId,
    title: "Pair Products",
    topic: "Number Theory",
    difficulty: "Easy",
    complexity: "O(N²)",
    explanation: "**Problem statement**\nCompute the product of |Ai-Aj| over all pairs i<j modulo m.",

    folderId: targetFolderId,
    createdBy: adminUser._id,
    visibility: "public",
    order: 0,
    isDeleted: false,

    slides: [
        {
            type: "intro",
            headline: "",
            body: "",
            blocks: []
        },
        {
            type: "explanation",
            headline: "💡 Core Idea",
            body: "👉 If two numbers have the same remainder modulo m, their difference is divisible by m.\n👉 Then the entire product becomes 0 modulo m.\n👉 By Pigeonhole Principle, if N>m, answer is always 0.\n👉 Otherwise brute force all pairs.",
            blocks: []
        },
        {
            type: "explanation",
            headline: "💡 Mathematical Insight",
            body: "👉 Only values modulo m matter.\n👉 N≤m implies N≤1000 since m≤1000.\n👉 Hence O(N²) pair iteration is feasible.\n👉 Multiply pair differences modulo m.",
            blocks: []
        },
        {
            type: "code",
            headline: "Code: C++ Implementation",
            body: "",
            code: `#include<bits/stdc++.h>
using namespace std;
int m=1e9+7;
using ll=long long;

void solve(){
    int n,mod;
    cin>>n>>mod;

    vector<ll> a(n);

    for(int i=0;i<n;i++) cin>>a[i];

    if(n>mod){
        cout<<0<<"\n";
        return;
    }

    ll ans=1;

    for(int i=0;i<n;i++){
        for(int j=i+1;j<n;j++){
            ans=(ans*(abs(a[i]-a[j])%mod))%mod;
        }
    }

    cout<<ans<<"\n";
}

int main(){
    ios_base::sync_with_stdio(0);
    cin.tie(0); cout.tie(0);

    int t=1;

    while(t--){
        solve();
    }
}`,
            blocks: []
        },
        {
            type: "code",
            headline: "Code: Python Implementation",
            body: "",
            code: `def solve():
    n,mod=map(int,input().split())
    a=list(map(int,input().split()))

    if n>mod:
        print(0)
        return

    ans=1

    for i in range(n):
        for j in range(i+1,n):
            ans=(ans*(abs(a[i]-a[j])%mod))%mod

    print(ans)

solve()`,
            blocks: []
        },
        {
            type: "dryrun",
            headline: "🔍 Learnings",
            body: "",
            steps: [
                "If N>m, answer is immediately 0.",
                "Equal remainders modulo m force a zero product.",
                "Otherwise brute force all pairs modulo m."
            ],
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
