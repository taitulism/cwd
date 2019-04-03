const { existsSync } = require('fs');

const resolveArguments = require('./resolve-args');
const execFile = require('./exec-file');
const runCmd = require('./run-cmd');
const runInShell = require('./run-in-shell');
const spawnProcess = require('./spawn-process');

function Cwd (dirPath) {
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

    isBadCmd (cmd, err) {
        if (!err) return false;

        return err.message.startsWith(`spawn ${cmd} ENOENT`);
    },

    getCmdFailMsg (cmd, args, opts, callback) {
        return `Failed Command:\n  cmd: ${cmd}\n  args: ${args}\n  opts: ${opts}\n  callback: ${typeof callback}\n`;
    },

    getBadCmdLogMsg (cmd, args, opts) {
        const argsLen = args.length;
        const argsStr = (argsLen === 0)
            ? ''
            : (argsLen === 1)
                ? ` ${args[0]} `
                : `
                    \r\t\t${args.join('\n\t\t')}
                    \r\t    `;
    
                    
        return `\n
            \r  Cwd.runCmd(cmd): Command not found
    
            \r      cmd: ${cmd}
            \r      args: [${argsStr}]
            \r      opts: ${JSON.stringify(opts)}
        `;
    },
}


