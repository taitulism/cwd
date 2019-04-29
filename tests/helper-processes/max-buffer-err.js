const {getString} = require('./common');

/* eslint-disable-next-line prefer-destructuring */
const targetSize = process.argv[2];

if (!targetSize) {
	throw new Error('max-buffer-err needs a target size argument');
}

const str = getString(targetSize);

process.stderr.write(str);
