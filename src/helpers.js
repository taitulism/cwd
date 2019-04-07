const { existsSync } = require('fs');

module.exports = {
    isBadCmd (cmd, err) {
        if (!err) return false;

        return err.message.startsWith(`spawn ${cmd} ENOENT`);
    },

    isBadDirectory (dirPath) {
        const exists = existsSync(dirPath);

        return !exists;
    },

    getCmdFailMsg (cmd, args, opts, callback) {
        return `Failed Command:\n  cmd: ${cmd}\n  args: ${args}\n  opts: ${opts}\n  callback: ${typeof callback}\n`;
	},

	getBadDirLogMsg (method, cwd) {
		return `\n
			\r  Cwd.${method}(options.cwd): Directory not found
			\r      Dir: ${cwd}
		`;
	},

    getBadCmdLogMsg (method, cmd, args, opts) {
        const argsLen = args.length;
        const argsStr = (argsLen === 0)
            ? ''
            : (argsLen === 1)
                ? ` ${args[0]} `
                : `
                    \r\t\t${args.join('\n\t\t')}
                    \r\t    `;


        return `\n
            \r  Cwd.${method}(cmd): Command not found

            \r      cmd: ${cmd}
            \r      args: [${argsStr}]
            \r      opts: ${JSON.stringify(opts)}
        `;
    },
};
