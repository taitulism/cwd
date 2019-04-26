const {spawn: _spawn} = require('child_process');
const normalizeArgs = require('./normalize-arguments');
const {validateCommand} = require('./helpers');
const parseCmd = require('./parse-command');
const childProc = require('./child-proc');

// const { isBadCmd, getBadCmdLogMsg, isBadDirectory } = require('./helpers');

module.exports = function spawn (cmdStr, ...rest) {
	validateCommand(cmdStr);

	const [cmd, cmdArgs, needShell] = parseCmd(cmdStr);

	const [argsAry, options] = normalizeArgs(...rest);

	const finalArgs = cmdArgs.concat(argsAry);

	if (!options.shell) {
		options.shell = needShell;
	}

	options.cwd = options.cwd || this.dirPath;

	const cp = _spawn(cmd, finalArgs, options);

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
