const { existsSync } = require('fs');

const helpers = {
	validateCommand (rawCmd) {
		if (!rawCmd || typeof rawCmd !== 'string') {
			const errMsg = getLogMsg.emptyCmd();
			throw new Error(errMsg);
		}
	},

    isBadCmd (cmd, err) {
        if (!err) return false;

        return err.message.startsWith(`spawn ${cmd} ENOENT`);
    },

    isBadDirectory (dirPath) {
        const exists = existsSync(dirPath);

        return !exists;
    },

};

const getLogMsg = {
	cmdFailed (cmd, args, opts, callback) {
		return `Failed Command:\n  cmd: ${cmd}\n  args: ${args}\n  opts: ${opts}\n  callback: ${typeof callback}\n`;
	},
	badDir (method, cwd) {
		return `\n
			\r  Cwd.${method}(options.cwd): Directory not found
			\r      Dir: ${cwd}
		`;
	},
	emptyCmd (method = 'spawnProcess') {
		return `Cwd.${method}() - First argument (cmd) must be a string.`
	},
	badCmd (method, cmd, args, opts) {
		const argsLen = args.length;
		const argsStr = (argsLen === 0)
			? ''
			: (argsLen === 1)
				? ` ${args[0]} `
				: `
					\r\t\t${args.join('\n\t\t')}
					\r\t    `
		;

		return `\n
			\r  Cwd.${method}(cmd): Command not found

			\r      cmd: ${cmd}
			\r      args: [${argsStr}]
			\r      opts: ${JSON.stringify(opts)}
		`;
	},
};

module.exports = {getLogMsg, ...helpers};
