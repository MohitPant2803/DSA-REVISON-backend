const fs = require('fs');

function searchFile(filePath, query) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes(query)) {
      console.log(`${filePath} L${idx + 1}: ${line.trim()}`);
    }
  });
}

searchFile('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\playlist\\[playlistId].tsx', 'hydratePlaylistCards');
searchFile('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\reels.tsx', 'hydratePlaylistCards');
searchFile('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\src\\hooks\\useSyncEngine.ts', 'hydratePlaylistCards');
