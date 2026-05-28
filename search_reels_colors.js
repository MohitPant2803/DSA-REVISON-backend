const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\reels.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('backgroundColor') || line.includes('bg-')) {
    if (idx >= 1290 && idx <= 1340) {
      console.log(`L${idx + 1}: ${line.trim()}`);
    }
  }
});
