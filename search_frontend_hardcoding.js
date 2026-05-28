const fs = require('fs');
const path = require('path');

function searchDir(dir, query) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.expo' && file !== 'dist') {
        searchDir(fullPath, query);
      }
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.json'))) {
      if (file === 'offlineSeed.json') continue; // Skip seed file since it will be overwritten
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes(query.toLowerCase())) {
        console.log(`Match in ${fullPath}:`);
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            console.log(`  L${idx + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

console.log('Searching for "Set Matrix Zeroes"...');
searchDir('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front', 'Set Matrix Zeroes');

console.log('\nSearching for "Pascal\'s Triangle"...');
searchDir('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front', "Pascal's Triangle");
searchDir('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front', "Pascal’s Triangle");
