const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'seed', 'dsaKnowledgeSeeder.ts');
const fileContent = fs.readFileSync(filePath, 'utf8');
const lines = fileContent.split('\n');

console.log(`Searching for data loading logic in ${filePath}...`);
let found = 0;
lines.forEach((line, idx) => {
  if (line.includes('fs.readFileSync') || line.includes('JSON.parse') || line.includes('striver_all_batches')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    found++;
  }
});
