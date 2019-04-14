const { spawn, exec, execFile } = require('child_process');

const createCwd = require('..');

const DIR = __dirname;

const cwd = createCwd(DIR);



(async () => {
	// const answer = await runCounter(process.cwd());
	execFile('ls', (err, out, er) => {

	})

	console.log('Did You Get It? -', answer);




})()




function runCounter () {
    return new Promise((resolve, reject) => {
        const p = cwd.spawnProcess('node', ['a-process.js']);

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
