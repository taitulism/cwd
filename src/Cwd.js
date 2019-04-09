const { existsSync } = require('fs');

// const execFile = require('../archive/exec-file');
// const runShellCmd = require('./run-shell-cmd');
const spawnProcess = require('./spawn-process');
const runCmd = require('./run-command');
// const spawnShell = require('./spawn-shell');

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

    spawnProcess,
    runCmd,
    // resolveArguments,
    // execFile,
    // runShellCmd,
    // spawnShell,
};
