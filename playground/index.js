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
    const [err, data] = await cwd.execFile('node', ['a-process.js'])

    if (err) {
        console.log('task');
        throw err;
    }

    return [err, data];
}



(async () => {
    try {
        // const isRepo = await isGitRepo(process.cwd());
        const [err, data] = await runCounter(process.cwd());

        if (err) {
            console.log('main proc');
            throw err;
        }

        console.log(data);
    }
    catch (err) {
        console.log('EXCEPTION');
        console.log(err);
        // logException('Process Failed', err)
    }
})()
