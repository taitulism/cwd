
const Cwd = require('./src/Cwd');
const resolveArgs = require('./src/private-methods/resolve-args');

const createCwd = dirPath => new Cwd(dirPath);
const defaultInstance = new Cwd();

createCwd.spawn = (...args) => defaultInstance.spawn(...args);
createCwd.spawnShell = (...args) => defaultInstance.spawnShell(...args);
createCwd.runCmd = (...args) => defaultInstance.runCmd(...args);
createCwd.runShellCmd = (...args) => defaultInstance.runShellCmd(...args);

createCwd.parent = {
	spawn (...args) {
		const [cmd, cmdArgs, options] = resolveArgs(...args);
		options.stdio = 'inherit';

		return defaultInstance.spawn(cmd, cmdArgs, options, true);
	},

	spawnShell (...args) {
		const [cmd, cmdArgs, options] = resolveArgs(...args);
		options.stdio = 'inherit';

		return defaultInstance.spawnShell(cmd, cmdArgs, options, true);
	},

	runCmd (...args) {
		const [cmd, cmdArgs, options] = resolveArgs(...args);
		options.stdio = 'inherit';

		return defaultInstance.runCmd(cmd, cmdArgs, options, true);
	},

	runShellCmd (...args) {
		const [cmd, cmdArgs, options] = resolveArgs(...args);
		options.stdio = 'inherit';

		return defaultInstance.runShellCmd(cmd, cmdArgs, options, true);
	},
};

module.exports = createCwd;
