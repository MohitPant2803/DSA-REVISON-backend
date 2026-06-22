require('dotenv').config();
const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI;

function cleanMathDelimiters(text) {
  if (typeof text !== 'string') return text;
  // Replace $$formula$$ with `formula` for inline RichText container rendering
  return text.replace(/\$\$([\s\S]*?)\$\$/g, (match, p1) => {
    return "`" + p1.trim() + "`";
  });
}

function cleanMathInObject(obj) {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return cleanMathDelimiters(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanMathInObject(item));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = cleanMathInObject(obj[key]);
    }
    return newObj;
  }
  return obj;
}

function splitCodeIntoChunks(code, maxLines = 18) {
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
  console.log(`Fetched ${cards.length} revision cards. Starting standardizations...`);

  let totalUpdatedCards = 0;

  for (const card of cards) {
    let wasModified = false;

    // 1. Clean math delimiters ($$) in the whole card (including title, subfolder, explanation, etc.)
    let cleanedCard = cleanMathInObject(card);
    if (JSON.stringify(card) !== JSON.stringify(cleanedCard)) {
      wasModified = true;
    }

    const slides = cleanedCard.slides || [];
    const newSlides = [];
    const codeSlides = [];

    // Find and isolate code slides to merge and re-split them
    for (const slide of slides) {
      // Standardize dry run type to 'dryrun' for frontend compatibility
      if (slide.type === 'dry-run' || slide.type === 'dryrun') {
        slide.type = 'dryrun';
      }

      // Standardize Optimal Approach heading
      if (
        slide.headline && (
          slide.headline.includes('Optimal Breakthrough') ||
          slide.headline.includes('Optimal Breakthrough') ||
          slide.headline.includes('Genius Optimization') ||
          slide.headline.includes('Optimal Approach')
        )
      ) {
        slide.headline = '🚀 Optimal Approach';
      }

      if (slide.type === 'code') {
        codeSlides.push(slide);
      }
    }

    // Process code slide(s)
    if (codeSlides.length > 0) {
      wasModified = true;
      
      // Combine code
      const combinedCode = codeSlides.map(s => s.code || '').join('\n').trim();
      const originalBody = codeSlides[0].body || 'Optimal in-place C++ solution.';
      const originalEmotion = codeSlides[0].emotion || 'confidence';

      const lineCount = combinedCode.split('\n').length;
      const splitSlides = [];

      if (lineCount <= 20) {
        // Fits on a single page! Headline must be exactly '💻 C++ Code'
        splitSlides.push({
          _id: codeSlides[0]._id || new mongoose.Types.ObjectId(),
          type: 'code',
          headline: '💻 C++ Code',
          emotion: originalEmotion,
          body: originalBody,
          code: combinedCode
        });
      } else {
        // Exceeds 20 lines: Split into parts of max 18 lines each!
        const chunks = splitCodeIntoChunks(combinedCode, 18);
        chunks.forEach((chunk, index) => {
          const partHeadline = `💻 C++ Code (Part ${index + 1}/${chunks.length})`;
          const partBody = index === 0 ? originalBody : (originalBody ? `${originalBody} (Continued)` : '');
          
          splitSlides.push({
            _id: new mongoose.Types.ObjectId(),
            type: 'code',
            headline: partHeadline,
            emotion: originalEmotion,
            body: partBody,
            code: chunk
          });
        });
      }

      // Rebuild the slide stack, replacing the original code slide positions with our new splits
      let addedCode = false;
      for (const slide of slides) {
        if (slide.type === 'code') {
          if (!addedCode) {
            splitSlides.forEach(s => newSlides.push(s));
            addedCode = true;
          }
        } else {
          newSlides.push(slide);
        }
      }
      
      cleanedCard.slides = newSlides;
    } else {
      cleanedCard.slides = slides;
    }

    if (wasModified) {
      await db.collection('revisioncards').updateOne(
        { _id: card._id },
        { $set: { 
            title: cleanedCard.title,
            explanation: cleanedCard.explanation,
            slides: cleanedCard.slides 
          } 
        }
      );
      totalUpdatedCards++;
    }
  }

  console.log('--------------------------------------------------');
  console.log(`Refinement Complete!`);
  console.log(`Total Cards Standardized in DB: ${totalUpdatedCards}`);
  console.log('--------------------------------------------------');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

run().catch(console.error);
