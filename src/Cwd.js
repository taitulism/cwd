const { existsSync } = require('fs');

const execFile = require('./exec-file');

function Cwd (dirPath) {
    const folderExists = existsSync(dirPath);

    if (!folderExists) throw new Error(`Cwd: No Such Directory "${dirPath}"`);

    this.dirPath = dirPath;
}

module.exports = Cwd;

Cwd.prototype = {
    constructor: Cwd,
    execFile,

    resolveArguments (userArgs, userOpts, userCallback) {
        let cmd = null,
            args = [],
            defaultOpts = { cwd: this.dirPath },
            callback = null;
            
        if (typeof userCallback === 'function') {
            callback = userCallback;
        }
        else if (typeof userOpts === 'function') {
            callback = userOpts;
        }
        else if (typeof userArgs === 'function') {
            callback = userArgs;
        }

        if (typeof userOpts === 'object') {
            opts = Object.assign({}, defaultOpts, userOpts);
        }
        else if (typeof userArgs === 'object') {
            opts = Object.assign({}, defaultOpts, userArgs);
        }

        if (Array.isArray(userArgs)) {
            args = userArgs;
        }

        return [args, opts, callback];
    },

    isSpawnCmdFailed (cmd, err) {
        if (err === null) return false;
        
        return err.message.startsWith(`spawn ${cmd} ENOENT`);
    },

    getCmdFailMsg (cmd, args, opts, callback) {
        return `Failed Command:\n  cmd: ${cmd}\n  args: ${args}\n  opts: ${opts}\n  callback: ${typeof callback}\n`;
    },
}