const {spawn: _spawn} = require('child_process');
const normalizeArgs = require('./normalize-arguments');
const {validateCommand} = require('./helpers');

// const { isBadCmd, getBadCmdLogMsg, isBadDirectory } = require('./helpers');

function parseCmd (rawCmdStr) {
	const cmdStr = rawCmdStr.trim();

	let cmd = cmdStr,
		needShell = false,
		cmdArgs = [];

	if (hasSpaces(cmdStr) || containsShellOperators(cmdStr)) {
		needShell = true;

		if (hasSpaces(cmdStr)) {
			const cmdSplit = cmdStr.split(' ');

			cmd = cmdSplit.shift();
			cmdArgs = cmdSplit;
		}
	}

	return [cmd, cmdArgs, needShell];
}

function hasSpaces (str) {
	return (/\s/u).test(str);
}

function containsShellOperators (str) {
	return (/[|&>;]/u).test(str);
}


module.exports = function spawn (cmdStr, ...rest) {
	validateCommand(cmdStr);

	const [cmd, cmdArgs, needShell] = parseCmd(cmdStr);

	const [argsAry, options] = normalizeArgs(...rest);

	const finalArgs = cmdArgs.concat(argsAry);

	if (!options.shell) {
		options.shell = needShell;
	}

	options.cwd = options.cwd || this.dirPath;

	const childProc = _spawn(cmd, finalArgs, options);

	childProc.on('error', (/* err */) => {
		beforeClose(childProc);

		/* if (isBadCmd(cmd, err)) {
			if (isBadDirectory(opts.cwd)) {
				const errMsg = getBadDirLogMsg('spawnProcess', opts.cwd);
				const exception = new Error(errMsg);
				childProc.emit('badDir');
			}

			const errMsg = getBadCmdLogMsg(cmd, cmdArgs, opts);
			const exception = new Error(errMsg);

			childProc.emit('badCmd');
		} */
	});

	childProc.stdout && registerLinesEvent(childProc, 'stdout', 'stdOut', 'hasData');
	childProc.stderr && registerLinesEvent(childProc, 'stderr', 'stdErr', 'hasErrors');

	childProc.on('close', () => {
		emitLastLines(childProc);
	});

	return childProc;
};

function registerLinesEvent (childProc, channel, eventName, flagName) {
	childProc[flagName] = false;
	childProc[channel].once('data', () => {
		childProc[flagName] = true;
	});

	childProc[channel].lineBuffer = '';
	childProc[channel].setEncoding('utf8').on('data', (chunk) => {
		childProc[channel].lineBuffer += chunk;

		/* eslint-disable-next-line newline-after-var */
		const lines = childProc[channel].lineBuffer
			.split('\n')
			.map(line => line.trim())
			// TODO:
			// .filter(line => line !== '')
		;

		if (lines.length > 0) {
			const lastLine = lines.pop();

			childProc[channel].lineBuffer = lastLine;
		}

		lines.length && childProc.emit(eventName, lines);
	});
}

function beforeClose (childProc) {
	destroyChannels(childProc);
	emitLastLines(childProc);
}

function destroyChannels (childProc) {
	childProc.stdout && childProc.stdout.destroy();
	childProc.stderr && childProc.stderr.destroy();
}

function emitLastLines (childProc) {
	if (childProc.stdout && childProc.stdout.lineBuffer) {
		childProc.emit('stdOut', [childProc.stdout.lineBuffer]);
	}

	if (childProc.stderr && childProc.stderr.lineBuffer) {
		childProc.emit('stdErr', [childProc.stderr.lineBuffer]);
	}
}
