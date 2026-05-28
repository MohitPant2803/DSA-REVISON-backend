const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../dsa-rev-front/src/constants/offlineSeed.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const cards = seed.revisionCards || [];
const targetCards = cards.filter(c => c.subfolderPath && c.subfolderPath.includes('Civic Utilities and Sports'));

console.log(`Found ${targetCards.length} cards in Civic Utilities and Sports inside offlineSeed.json:`);
targetCards.forEach(c => {
  console.log(`- Title: ${c.title}`);
  console.log(`  ID: ${c._id || c.id}`);
  console.log(`  Explanation: ${c.explanation ? c.explanation.substring(0, 100) + '...' : 'None'}`);
  if (c.slides) {
    console.log(`  Slides Count: ${c.slides.length}`);
    c.slides.forEach((s, idx) => {
      console.log(`    Slide ${idx + 1} (${s.type || 'unknown'}): ${s.headline}`);
      console.log(`      Body (first 100 chars): ${s.body ? s.body.substring(0, 100) + '...' : 'None'}`);
    });
  }
  console.log('--------------------------------------------------');
});
