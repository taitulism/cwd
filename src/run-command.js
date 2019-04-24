/* eslint-disable max-lines-per-function */

module.exports = function runCmd (cmdStr, ...rest) {
	// eslint-disable-next-line consistent-return
	return new Promise((resolve, reject) => {
		let exception = null;

		// eslint-disable-next-line no-magic-numbers
		const maxBuffer = 1024 * 1024 * 5; // ~5MB

		let childProc;

		try {
			childProc = this.spawn(cmdStr, ...rest);
		}
		catch (ex) {
			return reject(ex);
		}

		childProc.on('error', (err) => {
			reject(err);
			childProc.kill();
		});

		let stdOutBufferSize = 0;

		childProc.stdout.on('data', (chunk) => {
			const chunkSize = Buffer.byteLength(chunk, 'utf8');

			stdOutBufferSize += chunkSize;

			if (stdOutBufferSize > maxBuffer) {
				exception = new Error('Cwd.runCmd(): Max buffer size exceeded [stdout].');

				childProc.kill();
			}
		});

		let stdErrBufferSize = 0;

		childProc.stderr.on('data', (chunk) => {
			const chunkSize = Buffer.byteLength(chunk, 'utf8');

			stdErrBufferSize += chunkSize;

			if (stdErrBufferSize > maxBuffer) {
				exception = new Error('Cwd.runCmd(): Max buffer size exceeded [stderr].');
				childProc.kill();
			}
		});

		const stdoutLines = [];

		childProc.on('stdOut', (lines) => {
			stdoutLines.push(...lines);
		});

		const stderrLines = [];

		childProc.on('stdErr', (lines) => {
			stderrLines.push(...lines);
		});

		childProc.on('close', (code) => {
			if (exception) return reject(exception);

			const stdout = stdoutLines.join('\n');
			const stderr = stderrLines.join('\n');

			return resolve([code === 0, stdout, stderr]);
		});
	});
};
