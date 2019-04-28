/* eslint-disable */

const { spawn, exec, execFile } = require('child_process');

const createCwd = require('..');

const DIR = __dirname;

const cwd = createCwd(DIR);


async function getFiles () {
	const [isOk, stdout, stderr] = await cwd.runCmd(`node ../tests/helper-processes/max-buffer-err.js`, [1024*1024*5]);

	if (isOk)
		return stdout.split('\n');
	else
		return stderr;
}

(async () => {
try {


	// const cp = spawn('ls &&', ['echo hiiii', '&& echo bye'], {shell:true})
	const cp = cwd.spawn('ls &&', ['echo hiiii', '&& echo bye'])

	cp.on('stdOut', (lines) => {
		lines.forEach((line) => {
			console.log('LINE:', line);
		})
	})
	// cp.stdout.on('data', (chunk) => {
	// 	console.log('CHUNK:', chunk.toString());
	// })
	cp.on('close', (code) => {
		console.log(code);
	})
	cp.on('error', (err) => {
		console.log('ERROR:\n', err);
	})

	console.log('file:', cp.spawnfile);
	console.log('args:', cp.spawnargs);
	console.log('');


} catch (ex) {
	console.log('EX:\n', ex);
}



	// const p = await getFiles().then((res) => {
	// 	console.log(res);
	// })





	setTimeout(() => {}, 3000);
})()




function runCounter () {
    return new Promise((resolve, reject) => {
        const p = cwd.spawn('node', ['a-process.js']);

        let count = 0;
        p.on('stdOut', (lines) => {
			console.log('lines', lines);
            // lines.forEach(line => {
            //     if (line.startsWith('Count:')) {
            //         count++;
            //     }
            // });
        });

        let errors = [];
        p.on('stdErr', (lines) => {
            errors = errors.concat(lines)
        });

        p.on('close', (code) => {
            return resolve({errors, count})
            if (p.hasErrors) {
                console.log('p.stdErr', errors);
                return resolve(false)
            }

            if (code === 0) {
                return resolve(count)
            }
        });
    });
}
