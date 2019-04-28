const {existsSync} = require('fs');

const baseSpawn = require('./base-spawn');
const spawn = require('./spawn');
const spawnShell = require('./spawn-shell');
const runCmd = require('./run-command');

function Cwd (dirPath) {
	if (typeof dirPath !== 'string' || dirPath.trim() === '') {
		throw new Error('Expecting one argument <String>, a directory path');
	}

	const folderExists = existsSync(dirPath);

	if (!folderExists) throw new Error(`Cwd: No Such Directory "${dirPath}"`);

	this.dirPath = dirPath;
}

module.exports = Cwd;

Cwd.prototype = {
	constructor: Cwd,

	_spawn: baseSpawn,
	spawn,
	spawnShell,
	runCmd,
};
