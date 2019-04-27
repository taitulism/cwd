const baseSpawn = require('./base-spawn');
const resolveArgs = require('./private-methods/resolve-args');
const parseCmd = require('./private-methods/parse-command');

module.exports = function spawn (...args) {
	const [rawCmd, rawCmdArgs, options] = resolveArgs(...args);

	options.cwd = options.cwd || this.dirPath;

	const [cmd, cmdArgs, needShell] = parseCmd(rawCmd, rawCmdArgs);

	if (needShell && !options.shell) {
		options.shell = true;
	}

	return baseSpawn(cmd, cmdArgs, options);
};
