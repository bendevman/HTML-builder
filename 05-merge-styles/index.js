const fs = require('fs');
const path = require('path');
const { readdir, unlink } = require('fs/promises');
const { pipeline } = require('stream/promises');

async function createBundle(inputFolder, outputFolder) {
  const inputPath = path.join(__dirname, inputFolder);
  const outputPath = path.join(__dirname, outputFolder);
  const files = await readdir(inputPath, { withFileTypes: true });
  const fileList = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );
  await deleteBundle(outputPath);
  for (const file of fileList) {
    const readStream = fs.createReadStream(
      path.join(inputPath, file.name),
      'utf-8',
    );
    const writeStream = fs.createWriteStream(
      path.join(outputPath, 'bundle.css'),
      { flags: 'a' },
    );
    await pipeline(readStream, writeStream);
  }
}
async function deleteBundle(dirPath) {
  const files = await readdir(dirPath);
  for (const file of files) {
    if (file === 'bundle.css') {
      const filePath = path.join(dirPath, file);
      await unlink(filePath);
    }
  }
}
createBundle('styles', 'project-dist');
// createBundle('test-files/styles', 'test-files');
