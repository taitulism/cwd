/* eslint-disable */

const { spawn, exec, execFile } = require('child_process');

const Cwd = require('..');

const DIR = __dirname;

const cwd = Cwd(DIR);


async function getFiles () {
	const [isOk, stdout, stderr] = await cwd.runCmd(`node ../tests/helper-processes/max-buffer-err.js`, [1024*1024*5]);

	if (isOk)
		return stdout.split('\n');
	else
		return stderr;
}

(async () => {
	try {
		// const cp = cwd.spawn('  ls ', ['../'], {stdio: 'pipe'})
		// const cp = cwd.runCmd('  ls ', ['./'], {stdio: 'inherit'})
		const cp = cwd.parentProcess.runCmd('echo hi')

		cp.then((p) => {
			console.log('p', p);
		})

		// cp.on('line', (line) => {
		// 	console.log('line', line);
		// })

		// cp.on('close', (code) => {
		// 	console.log('code', code);
		// })




		setTimeout(() => {}, 5000);
	} catch (ex) {
		console.log('EXCEPTION:\n', ex);
	}

	setTimeout(() => {}, 3000);
})()
