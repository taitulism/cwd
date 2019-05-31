const spawn = require('./spawn');
const spawnShell = require('./spawn-shell');
const runCmd = require('./run-command');
const runShellCmd = require('./run-shell-command');

function Cwd (dirPath) {
	if (!dirPath || typeof dirPath !== 'string') {
		throw new Error('Cwd expects one argument <String>, a path to a directory.');
	}

	this.dirPath = dirPath;
}

module.exports = Cwd;

Cwd.prototype = {
	constructor: Cwd,
	spawn,
	spawnShell,
	runCmd,
	runShellCmd,
};
