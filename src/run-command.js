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

		let stdoutLines = [];
		childProc.on('stdOut', (lines) => {
			stdoutLines.push(...lines);
		});

		let stderrLines = [];
		childProc.on('stdErr', (lines) => {
			stderrLines.push(...lines);
		});

		childProc.on('close', (code) => {
			const stdout = stdoutLines.join('\n');
			const stderr = stderrLines.join('\n');

			return resolve([code === 0, stdout, stderr]);
		});
	});
};
