const {spawn} = require('child_process');
const childProc = require('./child-proc');

// const { isBadCmd, getBadCmdLogMsg, isBadDirectory } = require('./helpers');

module.exports = function _spawn (cmd, cmdArgs, options) {
	const cp = spawn(cmd, cmdArgs, options);

	cp.on('error', (/* err */) => {
		childProc.beforeClose(cp);

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

	childProc.registerLineEvents(cp);

	cp.on('close', () => {
		childProc.emitLastLines(cp);
	});

	return cp;
};
