const resolveArgs = require('./private-methods/resolve-args');

module.exports = function runShellCmd (...args) {
	const [cmd, cmdArgs, options] = resolveArgs(...args);

	if (!options.shell) {
		options.shell = true;
	}

	return this.runCmd(cmd, cmdArgs, options);
};
