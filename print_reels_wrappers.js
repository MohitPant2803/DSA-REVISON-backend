const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\reels.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 1279; i < 1335; i++) {
  if (lines[i] !== undefined) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
