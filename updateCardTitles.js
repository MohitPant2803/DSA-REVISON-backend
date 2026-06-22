require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

const titleMappings = {
  "Set Matrix Zeroes": {
    newTitle: "Set Matrix Rows and Columns to Zero if Element is Zero",
    introHeadline: "Set Matrix Rows and Columns to Zero if Element is Zero: Snapshot",
    introBody: `**Problem Statement**:
Given an \`m x n\` integer matrix, if any element is \`0\`, set its entire row and column to \`0\`'s in-place without using a duplicate matrix.

💡 **Simplified Analogy**:
Imagine an infected computer in a grid network: one zero infects its entire row and column like a cascading chain reaction.

👉 *But wait... brute force requires auxiliary arrays. Let's see how we can optimize this to constant O(1) extra space!*`
  },
  "Pascal's Triangle": {
    newTitle: "Generate Pascal's Triangle",
    introHeadline: "Generate Pascal's Triangle: Snapshot",
    introBody: `**Problem Statement**:
Given an integer \`numRows\`, generate and return the first \`numRows\` rows of Pascal's Triangle in-place.

💡 **Simplified Analogy**:
Like a cascading waterfall: each level is constructed by summing adjacent numbers flowing from the level directly above it.

👉 *But wait... how do we construct this row-by-row dynamically without arithmetic overflows? Let's check!*`
  },
  "Next Permutation": {
    newTitle: "Find Next Lexicographical Permutation"
  },
  "Kadane's Algorithm": {
    newTitle: "Find Maximum Subarray Sum"
  },
  "Sort Colors (Sort 0s, 1s, 2s)": {
    newTitle: "Sort Array of 0s, 1s, and 2s in-place"
  },
  "Stock Buy and Sell": {
    newTitle: "Find Maximum Profit from Stock Buy and Sell"
  },
  "Rotate Image/Matrix": {
    newTitle: "Rotate Matrix by 90 Degrees Clockwise in-place"
  },
  "Merge Overlapping Subintervals": {
    newTitle: "Merge Overlapping Intervals"
  },
  "Merge Sorted Array Without Extra Space": {
    newTitle: "Merge Two Sorted Arrays in-place Without Extra Space"
  },
  "Find the Duplicate Number": {
    newTitle: "Find the Single Duplicate Number in N+1 Array"
  },
  "Repeat and Missing Number": {
    newTitle: "Find Repeating and Missing Number in Array"
  },
  "Inversion of Array": {
    newTitle: "Count Inversions in an Array"
  },
  "Search a 2D Matrix": {
    newTitle: "Search in a Sorted 2D Matrix"
  },
  "Pow(x, n)": {
    newTitle: "Calculate x Raised to the Power n"
  },
  "Majority Element (>N/2)": {
    newTitle: "Find Majority Element appearing more than N/2 times"
  },
  "Majority Element II (>N/3)": {
    newTitle: "Find Majority Elements appearing more than N/3 times"
  },
  "Grid Unique Paths": {
    newTitle: "Count Unique Paths from Top-Left to Bottom-Right"
  },
  "Reverse Pairs": {
    newTitle: "Count Reverse Pairs where nums[i] > 2 * nums[j]"
  },
  "Two Sum": {
    newTitle: "Find Two Indices that Sum to Target"
  },
  "4-Sum": {
    newTitle: "Find all Unique Quadruplets that Sum to Target"
  },
  "Longest Consecutive Sequence": {
    newTitle: "Find Longest Consecutive Elements Sequence"
  },
  "Longest Subarray with 0 Sum": {
    newTitle: "Find Longest Subarray with Zero Sum"
  },
  "Count Number of Subarrays with Given XOR K": {
    newTitle: "Count Subarrays with XOR Sum Equal to K"
  },
  "Longest Substring Without Repeating Characters": {
    newTitle: "Find Longest Substring Without Repeating Characters"
  },
  "3 Sum": {
    newTitle: "Find all Unique Triplets that Sum to Zero"
  },
  "Trapping Rain Water": {
    newTitle: "Calculate Maximum Trapped Rain Water"
  },
  "Remove Duplicate from Sorted array": {
    newTitle: "Remove Duplicates from Sorted Array in-place"
  },
  "Max consecutive ones": {
    newTitle: "Find Max Consecutive Ones in Binary Array"
  }
};

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;
  const cardsCollection = db.collection('revisioncards');
  
  console.log('Starting card updates...');
  
  for (const [oldTitle, mapping] of Object.entries(titleMappings)) {
    const card = await cardsCollection.findOne({ title: oldTitle, isDeleted: { $ne: true } });
    if (!card) {
      console.log(`⚠️ Card with title "${oldTitle}" not found in database.`);
      continue;
    }
    
    const newTitle = mapping.newTitle;
    console.log(`Processing card: "${oldTitle}" -> "${newTitle}"`);
    
    // Create new slides array with updated intro slide if applicable
    let updatedSlides = card.slides ? [...card.slides] : [];
    if (updatedSlides.length > 0 && updatedSlides[0].type === 'intro') {
      const introHeadline = mapping.introHeadline || `${newTitle}: Snapshot`;
      updatedSlides[0] = {
        ...updatedSlides[0],
        headline: introHeadline
      };
      
      if (mapping.introBody) {
        updatedSlides[0].body = mapping.introBody;
      } else if (updatedSlides[0].body) {
        // Replace old title with new title in body if it doesn't have custom body
        updatedSlides[0].body = updatedSlides[0].body.replace(oldTitle, newTitle);
      }
    }
    
    // Update the card title and slides
    const updateResult = await cardsCollection.updateOne(
      { _id: card._id },
      { 
        $set: { 
          title: newTitle,
          slides: updatedSlides
        } 
      }
    );
    
    if (updateResult.modifiedCount > 0) {
      console.log(`  Successfully updated card ID ${card._id}`);
    } else {
      console.log(`  No modifications made for card ID ${card._id}`);
    }
  }
  
  await mongoose.disconnect();
  console.log('Database updates complete. Disconnected.');
}

run().catch(console.error);
