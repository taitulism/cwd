const { spawn, exec, execFile } = require('child_process');

const createCwd = require('..');

const DIR = __dirname;

const cwd = createCwd(DIR);

(async () => {
	try {
		const [a, b, returnValue] = await cwd.runCmd('ls', ['./bla']);
		console.log(111, a);
		console.log(222, b);
		console.log(333, returnValue);
	} catch (ex) {
		console.log('exception', ex);



		setTimeout(() => {}, 3000);
	}


	/**
	 * exception
	 * exit 0/1
	 * stdout
	 * stderr
	 */
	const [ex, [err, data]] = await cwd.runCmd('ls', ['./bla']);

	const [err, stdout, stderr] = await cwd.runCmd('ls', ['./blu']);




})()
