const fs = require('fs');
const pkg = require('../package.json');

const filePath = './src/environments/version.ts';
const content = `export const version = '${pkg.version}';\n`;

fs.writeFileSync(filePath, content, { encoding: 'utf8' });
console.log(`✔ Version ${pkg.version} correctly injected in ${filePath}`);