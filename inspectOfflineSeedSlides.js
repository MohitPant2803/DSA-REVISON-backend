const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:\\Users\\Mohit\\Desktop\\DSA Reels\\dsa-rev-front\\src\\constants\\offlineSeed.json', 'utf8'));

console.log(`Total folders: ${data.folders.length}`);
console.log(`Total playlists: ${data.playlists.length}`);
console.log(`Total cards: ${data.revisionCards.length}`);

const cardsWithSlides = data.revisionCards.filter(c => c.slides && c.slides.length > 0);
console.log(`Cards with custom slides: ${cardsWithSlides.length}`);

// Let's print details of the first few cards that have custom slides
cardsWithSlides.slice(0, 5).forEach(c => {
  console.log(`-----------------------------------------------`);
  console.log(`Card: "${c.title}"`);
  console.log(`First Slide:`, c.slides[0]);
});
