const baseSpawn = require('./base-spawn');
const normalizeArgs = require('./private-methods/normalize-arguments');
const {validateCommand} = require('./private-methods/helpers');
const parseCmd = require('./private-methods/parse-command');

module.exports = function spawn (cmdStr, ...rest) {
	validateCommand(cmdStr);

	const [cmd, cmdArgs, needShell] = parseCmd(cmdStr);

	const [argsAry, options] = normalizeArgs(...rest);

	const finalArgs = cmdArgs.concat(argsAry);

	if (!options.shell) {
		options.shell = needShell;
	}

	options.cwd = options.cwd || this.dirPath;

	return baseSpawn(cmd, finalArgs, options);
};
