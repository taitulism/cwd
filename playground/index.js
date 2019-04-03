const {spawn} = require('child_process');

const createCwd = require('../');
const logException = require('../src/log-exception');

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


async function runCounter () {
    return new Promise(async (resolve, reject) => {
        const p = await cwd.spawnProcess('nsode', ['a-process.js']);
        console.log('continue');


        // if (err) {
        //     console.log('cwd.spawnProcess err');
        //     reject(err);
        // }

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
            if (code === 0) {
                return resolve(count)
            }

            if (p.stdErr) {
                console.log('p.stdErr', errors);
                return resolve(false)
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




        // logException('Process Failed', err)
    }
})()
