const resolveArgs = require('./private-methods/resolve-args');
const parseCmd = require('./private-methods/parse-command');

module.exports = function runShellCmd (...args) {
	const [rawCmd, rawCmdArgs, options] = resolveArgs(...args);
	const [cmd, cmdArgs] = parseCmd(rawCmd, rawCmdArgs);

	if (!options.shell) {
		options.shell = true;
	}

	return this.runCmd(cmd, cmdArgs, options);
};
