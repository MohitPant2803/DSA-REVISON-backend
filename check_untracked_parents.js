const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.expo' && f !== 'dist') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

const targetIds = [
  '45346d5f-74a0-5f77-8387-72a28eec1e9f',
  '83a801a2-43a1-5cc8-8195-b796b2ad6875',
  '47eaf24e-2ab1-52f7-b89a-7e9a8df8ecc3'
];

const workspaces = [
  'c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-back',
  'c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front'
];

workspaces.forEach(workspace => {
  console.log(`Searching in workspace: ${workspace}`);
  walkDir(workspace, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.json')) {
      const content = fs.readFileSync(filePath, 'utf8');
      targetIds.forEach(id => {
        if (content.includes(id)) {
          console.log(`Found match for ID: ${id} in: ${filePath}`);
        }
      });
    }
  });
});
