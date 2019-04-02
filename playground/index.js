const createCwd = require('../');
const logException = require('../src/log-exception');
const {execFile, spawn, fork} = require('child_process');
const {exists} = require('fs');

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
    const [err, stdout, stderr] = await cwd.execFile('node', {cwd:'qwe'})

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
        // const answer = await runCounter(process.cwd());

        // console.time('shell test')
        // execFile("test", ['-d', './src'], (err, stdout, stderr) => {
        //     if (err) {
        //         console.log('callback error');
        //         throw err;                
        //     }
            
            
        //     console.timeEnd('shell test')
        // })

        // console.time('fs.exists')
        // exists('./src', (isThere) => {
        //     if (!isThere) {
        //         throw err;                
        //     }
            
        //     console.timeEnd('fs.exists')
        // })

        // console.log('Did You Get It? -', answer);


        const f = fork('playground/child.js');

        f.send('hi');
    }
    catch (err) {
        console.log('EXCEPTION');
        console.log(err);




        // logException('Process Failed', err)
    }
})()

/* TODO:
 * benchmark
 *      node child_process.exec("test -d "folder")
 *          vs.
 *      node fs.existsSync("folder")
 * 
 * runner process
 *  spawn a process once - use it many time. (stdin)
*/
