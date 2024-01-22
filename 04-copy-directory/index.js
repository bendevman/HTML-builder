const { readdir, mkdir, copyFile, unlink } = require('fs/promises');
const path = require('path');

async function copyDir() {
  const dirPath = path.join(__dirname, 'files');
  const newDirPath = path.join(__dirname, 'files-copy');
  const files = await readdir(dirPath);
  await mkdir(newDirPath, { recursive: true });
  await clearDir(newDirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const newFilePath = path.join(newDirPath, file);
    await copyFile(filePath, newFilePath);
  }
}
async function clearDir(dirPath) {
  const files = await readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    await unlink(filePath);
  }
}

copyDir();
