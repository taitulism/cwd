const createCwd = require('../');
const logException = require('../src/log-exception');

function isGitRepo (dir) {
    const cmd = 'gsit';
    const cmdArgs = ['rev-parse'];
    
    return cwd(dir).execFile(cmd, cmdArgs, (err, stdout, stderr) => {
        if (err) {
            console.log('task error');
            if (stderr.includes('Not a git repository')) {
                return resolve([null, false]);
            }

            return reject([`git rev-parse: ${dir}`, err]);
        }

        resolve([null, true]);
    });
};

const cwd = createCwd(__dirname);

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
        // const isRepo = await isGitRepo(process.cwd());
        const answer = await runCounter(process.cwd());

        console.log('Did You Get It? -', answer);
    }
    catch (err) {
        console.log(3, 'EXCEPTION');
        console.log(err);
        // logException('Process Failed', err)
    }
})()
