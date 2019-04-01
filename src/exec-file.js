const { execFile } = require('child_process');
const logAndDie = require('./log-and-die');

// this === Cwd instance
module.exports = function execFileWrapper (cmd, userArgs, userOpts, userCallback) {
    if (!cmd) {
        throw new Error('Cwd.execFile(): Command cannot be empty.')
    }
    
    const [args, opts, callback] = this.resolveArguments(userArgs, userOpts, userCallback);

    return new Promise((resolve, reject) => {
        const childProc = execFile(cmd, args, opts, (err, stdout, stderr) => {
            if (this.isSpawnCmdFailed(cmd, err)) {
                console.log(1);
                return reject([
                    `Cwd.execFile\n   Command: ${cmd}\n   Arguments: ${args}\n   Directory:${this.dirPath}`,
                    err
                ]);
            }            

            console.log('stderr', stderr);
            console.log('');
            if (err) {
                console.log('execFile inner callback error');
            }

            callback(stderr, stdout);
            return resolve({stderr, stdout});
        })
        .on('error', err => {
            console.log(2);
            console.log('childProc throwing...');
            reject(err);
        });
        
        return childProc;
    });
};
