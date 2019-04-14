const {forLoop, getString} = require('./common');

const targetSize = process.argv[2] || 200 * 1024; // 204800

forLoop(targetSize/10, () => {
	const str = getString(10)+'\n';

	process.stderr.write(str);
});
