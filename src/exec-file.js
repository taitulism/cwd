const { execFile } = require('child_process');
const logAndDie = require('./_log-and-die');

// this === Cwd instance
module.exports = function execFileWrapper (cmd, userArgs, userOpts, userCallback) {
    if (!cmd) {
        throw new Error('Cwd.execFile(): Command cannot be empty.')
    }
    
    const [args, opts, callback] = this.resolveArguments(userArgs, userOpts, userCallback);

    return new Promise((resolve, reject) => {
        execFile(cmd, args, opts, (err, stdout, stderr) => {
            if (err && this.isSpawnCmdFailed(cmd, err)) {
                return reject(err);
            }

            typeof callback == 'function' && callback(stderr, stdout);
            return resolve([null, {stderr, stdout}]);
        })
    });
};
