module.exports = function parseCmd (rawCmd, rawCmdArgs) {
	const cmdStr = rawCmd.trim();

	let cmd = cmdStr,
		cmdArgs = rawCmdArgs;

	const hasSpaces = (/\s/u).test(cmdStr);

	if (hasSpaces) {
		const cmdSplit = cmdStr.split(' ');

		cmd = cmdSplit.shift();
		cmdArgs = cmdSplit.concat(rawCmdArgs);
	}

	return [cmd, cmdArgs];
};
