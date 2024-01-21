const rl = require('readline');
const fs = require('fs');
const path = require('path');
const srcPath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(srcPath, { flags: 'a' }, 'utf-8');
const readline = rl.createInterface(process.stdin, process.stdout);
const exit = () => {
  process.stdout.write('Goodbye!');
  process.exit();
};

process.stdout.write('Waiting for input:\n');
readline.on('line', (data) => {
  if (data === 'exit') {
    exit();
  }
  writeStream.write(data + '\n');
});

readline.on('SIGINT', () => {
  exit();
});
