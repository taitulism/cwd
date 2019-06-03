const {spawn: nativeSpawn} = require('child_process');

const resolveArgs = require('./private-methods/resolve-args');
const childProcLib = require('./private-methods/child-proc');

module.exports = function spawn (...args) {
	const [cmd, cmdArgs, options] = resolveArgs(...args);

	options.cwd = options.cwd || this.dirPath;

	const cp = nativeSpawn(cmd, cmdArgs, options);

	cp.on('error', () => {
		childProcLib.beforeClose(cp);
	});

	childProcLib.registerLineEvents(cp);

	cp.on('close', () => {
		childProcLib.emitLastLines(cp);
	});

	return cp;
};
