const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(srcPath, 'utf-8');
const data = [];
readStream.on('data', (chank) => {
  data.push(chank);
});
readStream.on('end', () => {
  process.stdout.write(data.join(''));
});
