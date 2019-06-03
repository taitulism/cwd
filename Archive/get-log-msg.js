module.exports = {
	cmdFailed (cmd, args, opts, callback) {
		return `Failed Command:
			\r    cmd: ${cmd}
			\r    args: ${args}
			\r    opts: ${opts}
			\r    callback: ${typeof callback}
		`;
	},
	badDir (method, cwd) {
		return `\n
			\r  Cwd.${method}(options.cwd): Directory not found
			\r      Dir: ${cwd}
		`;
	},
	badCmd (method, cmd, args, opts) {
		const argsLen = args.length;

		/* eslint-disable-next-line newline-after-var, no-nested-ternary */
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
