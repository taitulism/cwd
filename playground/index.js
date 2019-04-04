const {spawn} = require('child_process');

const createCwd = require('../');
const cwd = createCwd(__dirname);

async function isGitRepo (dir) {
    const cmd = 'git';
    const cmdArgs = ['rev-parse'];

    const [err, stdout, stderr] = await createCwd(dir).runInShell('git rev-parse');

    if (err) {
        if (stderr.startsWith('fatal: Not a git repository')) {
            return false;
        }
        
        throw err;
    }

    console.log('stderr', stderr);
    console.log('stdout', stdout);
    
    return true;
};


function runCounter () {
    return new Promise((resolve, reject) => {
        const p = cwd.spawnProcess('node', ['a-process.js']);

        let count = 0;
        p.on('stdOut', (lines) => {
            lines.forEach(line => {
                if (line.startsWith('Count:')) {
                    count++;
                }
            });
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



(async () => {
    try {
        // const answer = await isGitRepo(__dirname);
        const answer = await runCounter(process.cwd());

        console.log('Did You Get It? -', answer);
    }
    catch (err) {
        console.log('EXCEPTION');
        console.log(err);
    }
})()
