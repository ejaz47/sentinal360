const fsExtra = require('fs-extra');

console.log('Copying to docs folder after build...');
fsExtra.copySync('./dist', './docs');
