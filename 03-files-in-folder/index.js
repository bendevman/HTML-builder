const { readdir, stat } = require('fs/promises');
const path = require('path');

async function getFilesInfo() {
  const srcPath = path.join(__dirname, 'secret-folder');
  const files = await readdir(srcPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(srcPath, file.name);
      let fileExt = path.extname(file.name);
      const fileName = path.basename(filePath, fileExt);
      fileExt = fileExt ? fileExt : fileName;
      const fileStats = await stat(filePath);
      console.log(`${fileName} - ${fileExt.slice(1)} - ${fileStats.size}b`);
    }
  }
}

getFilesInfo();
