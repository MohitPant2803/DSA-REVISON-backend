const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\src\\components\\ConceptCardPreview.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('bg-') || line.includes('backgroundColor') || line.includes('border')) {
    console.log(`L${idx + 1}: ${line.trim()}`);
  }
});
