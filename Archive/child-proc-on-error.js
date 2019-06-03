cp.on('error', (/* err */) => {
	childProcLib.beforeClose(cp);

	/* if (isBadCmd(cmd, err)) {
		if (isBadDirectory(opts.cwd)) {
			const errMsg = getBadDirLogMsg('spawnProcess', opts.cwd);
			const exception = new Error(errMsg);
			cp.emit('badDir');
		}

		const errMsg = getBadCmdLogMsg(cmd, cmdArgs, opts);
		const exception = new Error(errMsg);

		cp.emit('badCmd');
	} */
});
