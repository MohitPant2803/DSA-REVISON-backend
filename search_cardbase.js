const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\reels.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('cardBase:')) {
    console.log(`L${idx + 1}: ${line.trim()}`);
    // Print next 10 lines
    for (let i = 1; i <= 10; i++) {
      console.log(`  L${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});
