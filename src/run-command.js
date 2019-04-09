module.exports = function runCmd (cmdStr, ...rest) {
	return new Promise((resolve, reject) => {
		const ex = null;

		let childProc;
		try {
			childProc = this.spawnProcess(cmdStr, ...rest);
		} catch (ex) {
			return reject(ex);
		}

		childProc.on('error', (err) => {
			reject(err);
			childProc.kill();
		});

		let stdout = '';
		childProc.on('stdOut', (lines) => {
			stdout += lines.join('\n');
		});

		let stderr = '';
		childProc.on('stdErr', (lines) => {
			stderr += lines.join('\n');
		});

		childProc.on('close', (code) => {
			return resolve([code === 0, stdout, stderr]);
		});
	});
};
