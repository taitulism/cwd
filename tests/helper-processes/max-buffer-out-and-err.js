const {getString} = require('./common');

/* eslint-disable-next-line prefer-destructuring */
const targetSize = process.argv[2];

if (!targetSize) {
	throw new Error('max-buffer-out-and-err.js script needs a target size argument');
}

const outStr = getString(targetSize / 2);
const errStr = getString(targetSize / 2);

process.stdout.write(outStr);
process.stderr.write(errStr);
