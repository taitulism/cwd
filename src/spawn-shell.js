const baseSpawn = require('./base-spawn');
const resolveArgs = require('./private-methods/resolve-args');

module.exports = function spawnShell (...args) {
	const [cmd, cmdArgs, options] = resolveArgs(...args);

	options.cwd = options.cwd || this.dirPath;
	options.shell = options.shell || true;

	return baseSpawn(cmd, cmdArgs, options);
};
