const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\reels.tsx', 'utf8');
const lines = content.split('\n');

function printRange(start, end) {
  console.log(`=== LINES ${start} to ${end} ===`);
  for (let i = start - 1; i < end; i++) {
    if (lines[i] !== undefined) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
}

printRange(1120, 1145);
printRange(1310, 1335);
