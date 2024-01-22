const fs = require('fs');
const path = require('path');

const cssBundler = (input, output) => {
  const writeStream = fs.createWriteStream(
    path.join(__dirname, `${output}/style.css`),
    'utf-8',
  );
  fs.readdir(
    path.join(__dirname, `${input}/`),
    { withFileTypes: true },
    (err, files) => {
      if (err) {
        console.error(err);
      }
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.css') {
          const readStream = fs.createReadStream(
            path.join(__dirname, `${input}/` + file.name),
            'utf-8',
          );
          readStream.on('data', (data) => {
            writeStream.write(data);
          });
        }
      });
    },
  );
};

const copyAssets = (assets, distPath) => {
  fs.rm(distPath + `/${assets}`, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(err.message);
    }
    fs.mkdir(distPath + `/${assets}`, { recursive: true }, (err) => {
      if (err) {
        console.error(err.message);
      }
      fs.readdir(
        path.join(__dirname, `/${assets}`),
        { withFileTypes: true },
        (err, files) => {
          if (err) {
            console.error(err.message);
          }
          files.forEach((file) => {
            if (file.isFile()) {
              fs.copyFile(
                path.join(__dirname, `/${assets}/`) + file.name,
                distPath + `/${assets}/` + file.name,
                (err) => {
                  if (err) {
                    console.error(err.message);
                  }
                },
              );
            } else {
              copyAssets(assets + `/${file.name}`, distPath);
            }
          });
        },
      );
    });
  });
};

const htmlBuilder = async (components, template, distPath) => {
  try {
    let tamp = await fs.promises.readFile(
      path.join(__dirname, `${template}/`),
      'utf-8',
    );
    await fs.promises
      .readdir(path.join(__dirname, `${components}/`), { withFileTypes: true })
      .then((files) => {
        files.forEach(async (file) => {
          if (file.isFile() && path.extname(file.name) === '.html') {
            const content = await fs.promises.readFile(
              path.join(__dirname, `${components}/` + file.name),
              'utf-8',
            );
            const fileName = path.parse(
              path.join(__dirname, './secret-folder/' + file.name),
            ).name;
            tamp = tamp.replace(`{{${fileName}}}`, content);
            await fs.promises.writeFile(
              path.join(__dirname, `${distPath}/index.html`),
              tamp,
            );
          }
        });
      });
  } catch (err) {
    console.log(err.message);
  }
};

const pageBuilder = (assets, styles, components, template) => {
  const distPath = path.join(__dirname, 'project-dist');
  fs.rm(distPath + `/${assets}`, { recursive: true, force: true }, (err) => {
    if (err) {
      console.error(err.message);
    }
    fs.mkdir(distPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err.message);
      }
      cssBundler(styles, 'project-dist');
      copyAssets(assets, distPath);
      htmlBuilder(components, template, 'project-dist');
    });
  });
};

pageBuilder('assets', 'styles', 'components', 'template.html');
