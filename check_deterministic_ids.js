const crypto = require('crypto');

function generateDeterministicObjectId(inputStr) {
  const hash = crypto.createHash('sha256').update(inputStr).digest('hex');
  // Format as 8-4-4-4-12 hex string (UUID v4 structure)
  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
}

const sheets = ['Striver SDE Sheet', 'Blind 75', 'NeetCode 150', 'Grind 75'];

sheets.forEach(title => {
  const key = `folder-${title}|Sheets|DSA`;
  const id = generateDeterministicObjectId(key);
  console.log(`Sheet: "${title}" | Key: "${key}" | Generated ID: ${id}`);
});
