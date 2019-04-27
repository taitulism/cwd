module.exports = function parseCmd (rawCmd, rawCmdArgs) {
	const cmdStr = rawCmd.trim();

	let cmd = cmdStr,
		cmdArgs = rawCmdArgs;

	const hasSpaces = (/\s/u).test(rawCmd);
	const containsShellOperators = (/[|&>;]/u).test(rawCmd);
	const needShell = hasSpaces || containsShellOperators;

	if (hasSpaces) {
		const cmdSplit = rawCmd.split(' ');

		cmd = cmdSplit.shift();
		cmdArgs = cmdSplit.concat(rawCmdArgs);
	}

	return [cmd, cmdArgs, needShell];
};
