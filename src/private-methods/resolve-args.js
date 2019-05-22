const normalizeArgs = require('./normalize-arguments');
const getLogMsg = require('./get-log-msg');

module.exports = function resolveArgs (cmd, maybeArgs, maybeOptions) {
	validateCommand(cmd);

	const [cmdArgs, options] = normalizeArgs(maybeArgs, maybeOptions);

	return [cmd, cmdArgs, options];
};

function validateCommand (rawCmd) {
	const isValid = (typeof rawCmd === 'string') && rawCmd.length > 0;

	if (isValid) return;

	const errMsg = getLogMsg.emptyCmd();

	throw new Error(errMsg);
}
