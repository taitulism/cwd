module.exports = function runCmd (cmdStr, ...rest) {
	return new Promise((resolve, reject) => {
		let ex = null;
		const maxBuffer = 200 * 1024;

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

		let stdOutBufferSize = 0;
		childProc.stdout.on('data', (chunk) => {
			chunkSize = Buffer.byteLength(chunk, 'utf8');
			stdOutBufferSize += chunkSize;

			if (stdOutBufferSize > maxBuffer) {
				ex = new Error('Cwd.runCmd(): Max buffer size exceeded [stdout].')

				childProc.kill();
			}
		});

		let stdErrBufferSize = 0;
		childProc.stderr.on('data', (chunk) => {
			chunkSize = Buffer.byteLength(chunk, 'utf8');
			stdErrBufferSize += chunkSize;

			if (stdErrBufferSize > maxBuffer) {
				ex = new Error('Cwd.runCmd(): Max buffer size exceeded [stderr].')
				childProc.kill();
			}
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
			if (ex) return reject(ex);

			const stdout = stdoutLines.join('\n');
			const stderr = stderrLines.join('\n');


			return resolve([code === 0, stdout, stderr]);
		});
	});
};
