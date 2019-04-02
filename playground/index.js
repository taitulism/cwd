const createCwd = require('../');

const logException = require('../src/log-exception');
const {execFile, spawn, fork} = require('child_process');
const {exists} = require('fs');


const cwd = createCwd(__dirname);


async function isGitRepo (dir) {
    const cmd = 'git';
    const cmdArgs = ['rev-parse'];

    const [err, stdout, stderr] = await createCwd(dir).execFile(cmd, cmdArgs);

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
    const [err, stdout, stderr] = await cwd.execFile('node')

    if (err) {
        console.log('Task: runCounter()');
        console.log(stderr);
        throw err;
    }

    return (!stderr) ? true : false;
}



(async () => {
    try {
        const isRepo = await isGitRepo(__dirname);
        // const answer = await runCounter(process.cwd());

        console.log('Did You Get It? -', isRepo);
    }
    catch (err) {
        console.log('EXCEPTION');
        console.log(err);




        // logException('Process Failed', err)
    }
})()
