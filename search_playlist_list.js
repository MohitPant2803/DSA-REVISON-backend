const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\app\\(protected)\\(tabs)\\playlist\\[playlistId].tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('FlatList') || line.includes('ScrollView') || line.includes('renderItem') || line.includes('onEndReached')) {
    console.log(`L${idx + 1}: ${line.trim()}`);
  }
});
