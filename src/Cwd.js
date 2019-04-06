const { existsSync } = require('fs');

const resolveArguments = require('./resolve-args');
const execFile = require('../archive/exec-file');
const runCmd = require('./run-cmd');
const runInShell = require('./run-in-shell');
const spawnProcess = require('./spawn-process');
const spawnShell = require('./spawn-shell');

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
    
    resolveArguments,
    execFile,
    runCmd,
    runInShell,
    spawnProcess,
    spawnShell,
};
