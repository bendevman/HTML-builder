const fs = require('fs');
const path = require('path');
const {
  readdir,
  mkdir,
  copyFile,
  unlink,
  readFile,
  writeFile,
  rm,
} = require('fs/promises');
const { pipeline } = require('stream/promises');

async function copyFolder(folderPath, newFolderPath) {
  const files = await readdir(folderPath, { withFileTypes: true });

  await mkdir(newFolderPath, { recursive: true });
  await clearFolder(newFolderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file.name);
    const newFilePath = path.join(newFolderPath, file.name);
    if (file.isFile()) {
      await copyFile(filePath, newFilePath);
    } else {
      await copyFolder(
        path.join(folderPath, file.name),
        path.join(newFolderPath, file.name),
      );
    }
  }
}
async function clearFolder(folderPath) {
  const files = await readdir(folderPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      await unlink(filePath);
    } else {
      await clearFolder(path.join(folderPath, file.name));
      await rm(path.join(folderPath, file.name), { recursive: true });
    }
  }
}
async function createCssBundle(inputFolder, outputFolder, fileName) {
  const inputPath = path.join(__dirname, inputFolder);
  const outputPath = path.join(__dirname, outputFolder);
  const files = await readdir(inputPath, { withFileTypes: true });
  const fileList = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );
  await deleteCssBundle(outputPath, fileName);
  for (const file of fileList) {
    const readStream = fs.createReadStream(
      path.join(inputPath, file.name),
      'utf-8',
    );
    const writeStream = fs.createWriteStream(path.join(outputPath, fileName), {
      flags: 'a',
    });
    await pipeline(readStream, writeStream);
  }
}
async function deleteCssBundle(folderPath, fileName) {
  const files = await readdir(folderPath);
  for (const file of files) {
    if (file === fileName) {
      const filePath = path.join(folderPath, file);
      await unlink(filePath);
    }
  }
}
async function htmlBuilder(componentsFolder, template, outputPath) {
  let tamplateText = await readFile(path.join(__dirname, template), 'utf-8');
  const components = await readdir(path.join(__dirname, componentsFolder), {
    withFileTypes: true,
  });
  for (const component of components) {
    const componentName = path.basename(
      path.join(component.path, component.name),
      '.html',
    );
    const componentText = await readFile(
      path.join(__dirname, componentsFolder, component.name),
      'utf-8',
    );
    tamplateText = tamplateText.replace(`{{${componentName}}}`, componentText);
  }
  await writeFile(path.join(outputPath, 'index.html'), tamplateText);
}
async function createProject(
  assets,
  styles,
  components,
  template,
  outputFolder,
) {
  const outputPath = path.join(__dirname, outputFolder);

  await mkdir(outputPath, { recursive: true });
  await clearFolder(outputPath);
  await copyFolder(path.join(__dirname, assets), path.join(outputPath, assets));
  await createCssBundle(styles, outputFolder, 'style.css');
  await htmlBuilder(components, template, outputPath);
}

createProject(
  'assets',
  'styles',
  'components',
  'template.html',
  'project-dist',
);
