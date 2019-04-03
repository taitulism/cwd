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
    const p = await cwd.spawnProcess('node', ['a-process.js'])

    if (err) {
        console.log('Task: runCounter()');
        console.log(stderr);
        if (stderr) {
            throw err;
        }
    }

    return (!stderr) ? true : false;
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
