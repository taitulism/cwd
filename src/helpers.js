const { existsSync } = require('fs');

module.exports = {
    isBadCmd (cmd, err) {
        if (!err) return false;

        return err.message.startsWith(`spawn ${cmd} ENOENT`);
    },

    isBadDirectory (opts, dirPath) {
        if (opts.cwd === dirPath) return false;
    
        const exists = existsSync(opts.cwd);
    
        return !exists;
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
};
