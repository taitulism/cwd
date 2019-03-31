const cwd = require('../');

function isGitRepo (dir) {
    const cmd = 'gsdit';
    const cmdArgs = ['rev-parse'];
    
    return new Promise((resolve, reject) => {
        cwd(dir).execFile(cmd, cmdArgs, (err, stdout, stderr) => {
            if (err) {
                console.log('task error');
                if (stderr.includes('Not a git repository')) {
                    return resolve([null, false]);
                }

                return reject([`git rev-parse: ${dir}`, err]);
            }

            resolve([null, true]);
        });
    });
};

(async () => {
    try {
        const isRepo = await isGitRepo(process.cwd());
        console.log(isRepo);
    }
    catch (err) {
        console.error('EXCEPTION:');
        console.error('  ', err[0]);
        console.error('  ', err[1]);
    }
})()
