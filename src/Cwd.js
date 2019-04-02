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

    resolveArguments (userCmd, userArgs, userOpts, userCallback) {
        let cmd = null,
            cmdArgs = [],
            args = [],
            opts = null,
            defaultOpts = { cwd: this.dirPath },
            callback = null;
            
        if (!userCmd) return [null];

        const cleanCmd = userCmd.trim().replace(/\s{2,}/g, ' ');

        if (!cleanCmd) return [null];
        
        const cmdParts = cleanCmd.split(' ');

        if (cmdParts.length >= 1) {
            cmd = cmdParts.shift();
            cmdArgs = cmdParts;
        }

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

        opts = opts || defaultOpts;

        return [cmd, cmdArgs.concat(args), opts, callback];
    },

    isBadCmd (cmd, err) {
        if (!err) return false;

        return err.message.startsWith(`spawn ${cmd} ENOENT`);
    },

    getCmdFailMsg (cmd, args, opts, callback) {
        return `Failed Command:\n  cmd: ${cmd}\n  args: ${args}\n  opts: ${opts}\n  callback: ${typeof callback}\n`;
    },
}