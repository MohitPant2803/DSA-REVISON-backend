require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

function splitCodeIntoChunks(code, maxLines = 13) {
  const lines = code.split('\n');
  const chunks = [];
  for (let i = 0; i < lines.length; i += maxLines) {
    chunks.push(lines.slice(i, i + maxLines).join('\n'));
  }
  return chunks;
}

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(mongoUri, { dbName: 'test' });
  console.log('Connected successfully!');
  
  const db = mongoose.connection.db;

  console.log('Fetching all revision cards...');
  const cards = await db.collection('revisioncards').find({}).toArray();
  console.log(`Fetched ${cards.length} revision cards. Scanning for code slides to split...`);

  let totalUpdatedCards = 0;
  let totalNewSlidesCreated = 0;

  for (const card of cards) {
    let wasModified = false;
    const newSlides = [];

    for (const slide of card.slides) {
      if (slide.type === 'code' && slide.code) {
        const lines = slide.code.split('\n');
        if (lines.length > 15) {
          // Exceeds 15 lines: Split!
          const chunks = splitCodeIntoChunks(slide.code, 13);
          console.log(`Card: "${card.title}" | Splitting code slide (${lines.length} lines) into ${chunks.length} chunks...`);
          
          chunks.forEach((chunk, index) => {
            const partHeadline = `${slide.headline || '💻 Code'} (Part ${index + 1}/${chunks.length})`;
            const partBody = index === 0 ? slide.body : (slide.body ? `${slide.body} (Continued)` : '');
            
            newSlides.push({
              _id: new mongoose.Types.ObjectId(),
              type: 'code',
              headline: partHeadline,
              emotion: slide.emotion || 'confidence',
              body: partBody,
              code: chunk
            });
          });

          totalNewSlidesCreated += (chunks.length - 1);
          wasModified = true;
        } else {
          newSlides.push(slide);
        }
      } else {
        newSlides.push(slide);
      }
    }

    if (wasModified) {
      // Save changes back to MongoDB
      await db.collection('revisioncards').updateOne(
        { _id: card._id },
        { $set: { slides: newSlides } }
      );
      totalUpdatedCards++;
    }
  }

  console.log('--------------------------------------------------');
  console.log(`Migration Complete!`);
  console.log(`Total Cards Updated in DB: ${totalUpdatedCards}`);
  console.log(`Total New Code Slides Appended: ${totalNewSlidesCreated}`);
  console.log('--------------------------------------------------');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

run().catch(console.error);
