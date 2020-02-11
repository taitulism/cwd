/* eslint-disable */

const { spawn, exec, execFile } = require('child_process');

const Cwd = require('..');

const DIR = __dirname;

const cwd = Cwd(DIR);


(async () => {
	try {
		const cp = cwd.spawn('echo AAA\nBBB');

		// .then((p) => {
		// 	console.log('p', p);
		// })

		cp.on('line', (line) => {
			console.log('line', line);
		})

		cp.on('close', (code) => {
			console.log('code', code);
		})




		setTimeout(() => {}, 5000);
	} catch (ex) {
		console.log('EXCEPTION:\n', ex);
	}

	setTimeout(() => {}, 3000);
})()
