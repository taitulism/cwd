const normalizeArgs = require('./normalize-arguments');
const {CmdIsNotString, CmdIsEmptyString} = require('./errors');

module.exports = function resolveArgs (rawCmd, maybeArgs, maybeOptions) {
	validateCommand(rawCmd);

	const [cmd, rawArgs] = extractArgsFromCmd(rawCmd);

	const [additionalArgs, options] = normalizeArgs(maybeArgs, maybeOptions);

	const cmdArgs = rawArgs.concat(additionalArgs);

	return [cmd, cmdArgs, options];
};

function validateCommand (rawCmd) {
	if (typeof rawCmd !== 'string') throw new Error(CmdIsNotString);

	if (rawCmd.length === 0) throw new Error(CmdIsEmptyString);
}

function extractArgsFromCmd (rawCmd) {
	let cmd, cmdArgs;

	cmd = rawCmd.trim();
	const hasSpaces = (/\s/u).test(cmd);

	if (hasSpaces) {
		cmdArgs = rawCmd.split(/\s+/u);
		cmd = cmdArgs.shift();
	}

	cmd = cmd || rawCmd;
	cmdArgs = cmdArgs || [];

	return [cmd, cmdArgs];
}
