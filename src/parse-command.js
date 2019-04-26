module.exports = function parseCmd (rawCmdStr) {
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
};

function hasSpaces (str) {
	return (/\s/u).test(str);
}

function containsShellOperators (str) {
	return (/[|&>;]/u).test(str);
}
