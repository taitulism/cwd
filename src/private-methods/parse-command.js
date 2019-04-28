module.exports = function parseCmd (rawCmd, rawCmdArgs) {
	const cmdStr = rawCmd.trim();

	let cmd = cmdStr,
		cmdArgs = rawCmdArgs;

	const hasSpaces = (/\s/u).test(rawCmd);

	if (hasSpaces) {
		const cmdSplit = rawCmd.split(' ');

		cmd = cmdSplit.shift();
		cmdArgs = cmdSplit.concat(rawCmdArgs);
	}

	// shell operators requires spawn with a shell ("|", "&", ">", ";")
	const needShell = containsShellOperators(cmd) || containsShellOperators(cmdArgs);

	return [cmd, cmdArgs, needShell];
};

function containsShellOperators (cmdOrArgs) {
	if (typeof cmdOrArgs === 'string') {
		return (/[|&>;]/u).test(cmdOrArgs);
	}

	// is array
	const len = cmdOrArgs.length;

	for (let i = 0; i < len; i++) {
		const arg = cmdOrArgs[i];

		if (containsShellOperators(arg)) {
			return true;
		}
	}

	return false;
}
