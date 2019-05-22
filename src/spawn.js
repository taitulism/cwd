const resolveArgs = require('./private-methods/resolve-args');
const parseCmd = require('./private-methods/parse-command');

module.exports = function spawn (...args) {
	const [rawCmd, rawCmdArgs, options] = resolveArgs(...args);
	const [cmd, cmdArgs] = parseCmd(rawCmd, rawCmdArgs);

	const childProc = this._spawn(cmd, cmdArgs, options);

	return childProc;
};
