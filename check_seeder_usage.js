const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'seed', 'dsaKnowledgeSeeder.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');
const lines = fileContent.split('\n');

console.log(`Searching for SHEET_CONFIGS usage in ${filePath}...`);
let lineIdx = 0;
lines.forEach((line, idx) => {
  if (line.includes('SHEET_CONFIGS') && idx > 200) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // Print 10 lines of context
    const start = Math.max(0, idx - 5);
    const end = Math.min(lines.length - 1, idx + 15);
    console.log('--- Context ---');
    for (let i = start; i <= end; i++) {
      console.log(`  ${i + 1}: ${lines[i]}`);
    }
    console.log('----------------');
  }
});
