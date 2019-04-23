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

	/* A childProc.on('error', err => {
		if (isBadCmd(cmd, err)) {
			if (isBadDirectory(opts.cwd)) {
				const errMsg = getBadDirLogMsg('spawnProcess', opts.cwd);
				const exception = new Error(errMsg);
				throw exception;
			}

			const errMsg = getBadCmdLogMsg(cmd, cmdArgs, opts);
			const exception = new Error(errMsg);

			throw exception;
		}

		throw err;
	}); */

	childProc.stdout && registerLinesEvent(childProc, 'stdout', 'stdOut', 'hasData');
	childProc.stderr && registerLinesEvent(childProc, 'stderr', 'stdErr', 'hasErrors');

	childProc.on('close', () => {
		if (childProc.stdout && childProc.stdout.lineBuffer) {
			childProc.emit('stdOut', [childProc.stdout.lineBuffer]);
		}
		if (childProc.stderr && childProc.stderr.lineBuffer) {
			childProc.emit('stdErr', [childProc.stderr.lineBuffer]);
		}
	});

	return childProc;
};

function registerLinesEvent (proc, channel, eventName, flagName) {
	proc[flagName] = false;
	proc[channel].once('data', () => {
		proc[flagName] = true;
	});

	proc[channel].lineBuffer = '';
	proc[channel].setEncoding('utf8').on('data', (chunk) => {
		proc[channel].lineBuffer += chunk;

		/* eslint-disable-next-line newline-after-var */
		const lines = proc[channel].lineBuffer
			.split('\n')
			.map(line => line.trim())
			// TODO:
			// .filter(line => line !== '')
		;

		if (lines.length > 0) {
			const lastLine = lines.pop();

			proc[channel].lineBuffer = lastLine;
		}

		lines.length && proc.emit(eventName, lines);
	});
}
