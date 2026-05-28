const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\reels.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes("slide.type === 'intro'") || line.includes('slide.type === "intro"')) {
    console.log(`L${idx + 1}: ${line.trim()}`);
  }
});
