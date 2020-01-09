/* eslint-disable max-lines-per-function, max-statements */

const resolveArgs = require('./private-methods/resolve-args');

const DEFAULT_MAX_CACHE = 10; // ~10MB

// eslint-disable-next-line no-magic-numbers
const MB2Bytes = mb => mb * 1024 * 1024;

function resolveCacheSize (mb) {
	return (typeof mb === 'number' && mb >= 0)
		? MB2Bytes(mb)
		: MB2Bytes(DEFAULT_MAX_CACHE);
}

module.exports = function runCmd (...args) {
	const [cmd, cmdArgs, options] = resolveArgs(...args);
	const maxCacheSize = resolveCacheSize(options.maxCacheSize);

	// eslint-disable-next-line consistent-return
	return new Promise((resolve, reject) => {
		let exception = null;
		let childProc;

		try {
			childProc = this.spawn(cmd, cmdArgs, options, true);
		}
		catch (ex) {
			return reject(ex);
		}

		childProc.on('error', (err) => {
			reject(err);
			childProc.kill();
		});

		let bufferSize = 0;

		childProc.stdout && childProc.stdout.on('data', (chunk) => {
			const chunkSize = Buffer.byteLength(chunk, 'utf8');
			bufferSize += chunkSize;

			if (bufferSize > maxCacheSize) {
				exception = new Error('Cwd.runCmd(): Max buffer size exceeded [stdout].');
				childProc.kill();
			}
		});

		childProc.stderr && childProc.stderr.on('data', (chunk) => {
			const chunkSize = Buffer.byteLength(chunk, 'utf8');
			bufferSize += chunkSize;

			if (bufferSize > maxCacheSize) {
				exception = new Error('Cwd.runCmd(): Max buffer size exceeded [stderr].');
				childProc.kill();
			}
		});

		const stdoutLines = [];
		childProc.on('line/out', (line) => {
			stdoutLines.push(line);
		});

		const stderrLines = [];
		childProc.on('line/err', (line) => {
			stderrLines.push(line);
		});

		const outputLines = [];
		childProc.on('line', (line) => {
			outputLines.push(line);
		});

		childProc.on('close', (exitCode) => {
			if (exception) return reject(exception);

			return resolve({
				exitCode,
				isOk: exitCode === 0,
				stdoutLines,
				stderrLines,
				outputLines,
				get stdout () {
					return stdoutLines.join('\n');
				},
				get stderr () {
					return stderrLines.join('\n');
				},
				get output () {
					return outputLines.join('\n');
				},
			});
		});
	});
};
