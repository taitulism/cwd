const {spawn: nativeSpawn} = require('child_process');

const resolveArgs = require('./private-methods/resolve-args');
const parseCmd = require('./private-methods/parse-command');
const childProcLib = require('./private-methods/child-proc');

module.exports = function spawn (...args) {
	const [rawCmd, rawCmdArgs, options] = resolveArgs(...args);
	const [cmd, cmdArgs] = parseCmd(rawCmd, rawCmdArgs);

	options.cwd = options.cwd || this.dirPath;

	const cp = nativeSpawn(cmd, cmdArgs, options);

	cp.on('error', (/* err */) => {
		childProcLib.beforeClose(cp);

		/* if (isBadCmd(cmd, err)) {
			if (isBadDirectory(opts.cwd)) {
				const errMsg = getBadDirLogMsg('spawnProcess', opts.cwd);
				const exception = new Error(errMsg);
				cp.emit('badDir');
			}

			const errMsg = getBadCmdLogMsg(cmd, cmdArgs, opts);
			const exception = new Error(errMsg);

			cp.emit('badCmd');
		} */
	});

	childProcLib.registerLineEvents(cp);

	cp.on('close', () => {
		childProcLib.emitLastLines(cp);
	});

	return cp;
};
