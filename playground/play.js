/* eslint-disable */

const { spawn, exec, execFile } = require('child_process');

const Cwd = require('..');

const DIR = __dirname;

const cwd = new Cwd(DIR);


async function getFiles () {
	const [isOk, stdout, stderr] = await cwd.runCmd(`node ../tests/helper-processes/max-buffer-err.js`, [1024*1024*5]);

	if (isOk)
		return stdout.split('\n');
	else
		return stderr;
}

(async () => {
try {
	await execFile('echod hello', (err, out, warns) => {
		console.log('err', err);
		console.log('out', out);
		console.log('warns', warns);
	})

	return;



	// const cp = spawn('ls &&', ['echo hiiii', '&& echo bye'], {shell:true})
	const cp = cwd.spawn('ls ', ['./'])

	cp.on('stdOut', (lines) => {
		lines.forEach((line) => {
			console.log('LINE:', line);
		})
	})
	// cp.stdout.on('data', (chunk) => {
	// 	console.log('CHUNK:', chunk.toString());
	// })
	cp.on('close', (code) => {
		console.log('closed', code);
	})
	cp.on('error', (err) => {
		console.log('ERROR:\n', err);
	})

	// cp.kill()

	console.log('file:', cp.spawnfile);
	console.log('args:', cp.spawnargs);
	console.log('');



	setTimeout(() => {}, 5000);
} catch (ex) {
	console.log('EX:\n', ex);
}



	// const p = await getFiles().then((res) => {
	// 	console.log(res);
	// })





	setTimeout(() => {}, 3000);
})()
