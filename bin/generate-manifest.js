const process = require('process');

const manifest = require('../manifest.template.json');
const package = require('../package.json');

process.stdout.write(JSON.stringify(
  Object.assign(
    {},
    manifest,
    { version: package.version }
  ), false, 2
));
