const baseSpawn = require('./base-spawn');
const normalizeArgs = require('./normalize-arguments');
const {validateCommand} = require('./helpers');
const parseCmd = require('./parse-command');

module.exports = function spawnShell (cmdStr, ...rest) {
	validateCommand(cmdStr);

	const [cmd, cmdArgs, needShell] = parseCmd(cmdStr);

	const [argsAry, options] = normalizeArgs(...rest);

	const finalArgs = cmdArgs.concat(argsAry);

	if (!options.shell) {
		options.shell = needShell;
	}

	options.cwd = options.cwd || this.dirPath;
	options.shell = options.shell || true;

	return baseSpawn(cmd, finalArgs, options);
};
