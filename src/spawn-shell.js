const resolveArgs = require('./private-methods/resolve-args');

module.exports = function spawnShell (...args) {
	const [cmd, cmdArgs, options] = resolveArgs(...args);

	options.shell = options.shell || true;

	const childProc = this._spawn(cmd, cmdArgs, options);

	return childProc;
};
