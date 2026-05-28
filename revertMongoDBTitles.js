const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://mohitpant1828_db_user:jnBW5KSgqLe3mFVC@cluster0.toqly2n.mongodb.net/?appName=Cluster0';

const revertMappings = {
  "Set Matrix Rows and Columns to Zero if Element is Zero": {
    originalTitle: "Set Matrix Zeroes",
    introHeadline: "Set Matrix Zeroes",
    introBody: `⚡ Collapse rows and columns containing zeros to zero in-place.

\`[1,1,1]\`     \`[1,0,1]\`
\`[1,0,1]\`  ➔  \`[0,0,0]\`
\`[1,1,1]\`     \`[1,0,1]\`

🧠 Recall:
- Reuse first row and first column as markers
- Use \`col0\` separately to track column 0
- Traverse backwards to prevent early marker overwrites`
  },
  "Generate Pascal's Triangle": {
    originalTitle: "Pascal's Triangle",
    introHeadline: "Pascal’s Triangle",
    introBody: `🔺 Every element is formed using the TWO elements above it.

\`[1]\`
\`[1,1]\`
\`[1,2,1]\`
\`[1,3,3,1]\`

🧠 Recall:
- Boundary values are always \`1\`
- Middle = top-left + top-right
- Build current row from previous row`
  },
  "Find Next Lexicographical Permutation": {
    originalTitle: "Next Permutation"
  },
  "Find Maximum Subarray Sum": {
    originalTitle: "Kadane's Algorithm"
  },
  "Sort Array of 0s, 1s, and 2s in-place": {
    originalTitle: "Sort Colors (Sort 0s, 1s, 2s)"
  },
  "Find Maximum Profit from Stock Buy and Sell": {
    originalTitle: "Stock Buy and Sell"
  },
  "Rotate Matrix by 90 Degrees Clockwise in-place": {
    originalTitle: "Rotate Image/Matrix"
  },
  "Merge Overlapping Intervals": {
    originalTitle: "Merge Overlapping Subintervals"
  },
  "Merge Two Sorted Arrays in-place Without Extra Space": {
    originalTitle: "Merge Sorted Array Without Extra Space"
  },
  "Find the Single Duplicate Number in N+1 Array": {
    originalTitle: "Find the Duplicate Number"
  },
  "Find Repeating and Missing Number in Array": {
    originalTitle: "Repeat and Missing Number"
  },
  "Count Inversions in an Array": {
    originalTitle: "Inversion of Array"
  },
  "Search in a Sorted 2D Matrix": {
    originalTitle: "Search a 2D Matrix"
  },
  "Calculate x Raised to the Power n": {
    originalTitle: "Pow(x, n)"
  },
  "Find Majority Element appearing more than N/2 times": {
    originalTitle: "Majority Element (>N/2)"
  },
  "Find Majority Elements appearing more than N/3 times": {
    originalTitle: "Majority Element II (>N/3)"
  },
  "Count Unique Paths from Top-Left to Bottom-Right": {
    originalTitle: "Grid Unique Paths"
  },
  "Count Reverse Pairs where nums[i] > 2 * nums[j]": {
    originalTitle: "Reverse Pairs"
  },
  "Find Two Indices that Sum to Target": {
    originalTitle: "Two Sum"
  },
  "Find all Unique Quadruplets that Sum to Target": {
    originalTitle: "4-Sum"
  },
  "Find Longest Consecutive Elements Sequence": {
    originalTitle: "Longest Consecutive Sequence"
  },
  "Find Longest Subarray with Zero Sum": {
    originalTitle: "Longest Subarray with 0 Sum"
  },
  "Count Subarrays with XOR Sum Equal to K": {
    originalTitle: "Count Number of Subarrays with Given XOR K"
  },
  "Find Longest Substring Without Repeating Characters": {
    originalTitle: "Longest Substring Without Repeating Characters"
  },
  "Find all Unique Triplets that Sum to Zero": {
    originalTitle: "3 Sum"
  },
  "Calculate Maximum Trapped Rain Water": {
    originalTitle: "Trapping Rain Water"
  },
  "Remove Duplicates from Sorted Array in-place": {
    originalTitle: "Remove Duplicate from Sorted array"
  },
  "Find Max Consecutive Ones in Binary Array": {
    originalTitle: "Max consecutive ones"
  }
};

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;
  const cardsCollection = db.collection('revisioncards');
  
  console.log('Starting card reversions...');
  
  for (const [currentTitle, mapping] of Object.entries(revertMappings)) {
    const card = await cardsCollection.findOne({ title: currentTitle, isDeleted: { $ne: true } });
    if (!card) {
      console.log(`⚠️ Card with title "${currentTitle}" not found in database.`);
      continue;
    }
    
    const originalTitle = mapping.originalTitle;
    console.log(`Reverting card: "${currentTitle}" -> "${originalTitle}"`);
    
    // Create reverted slides array
    let updatedSlides = card.slides ? [...card.slides] : [];
    if (updatedSlides.length > 0 && updatedSlides[0].type === 'intro') {
      const introHeadline = mapping.introHeadline || `${originalTitle}: Snapshot`;
      updatedSlides[0] = {
        ...updatedSlides[0],
        headline: introHeadline
      };
      
      if (mapping.introBody) {
        updatedSlides[0].body = mapping.introBody;
      } else if (updatedSlides[0].body) {
        // Replace current title with original title in body
        updatedSlides[0].body = updatedSlides[0].body.replace(currentTitle, originalTitle);
      }
    }
    
    // Revert the card title and slides
    const updateResult = await cardsCollection.updateOne(
      { _id: card._id },
      { 
        $set: { 
          title: originalTitle,
          slides: updatedSlides
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`  Successfully reverted card ID ${card._id}`);
    } else {
      console.log(`  No modifications made for card ID ${card._id}`);
    }
  }
  
  await mongoose.disconnect();
  console.log('Database reversions complete. Disconnected.');
}

run().catch(console.error);
