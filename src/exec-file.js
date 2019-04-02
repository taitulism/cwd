const { execFile } = require('child_process');
const logAndDie = require('./_log-and-die');

// this === Cwd instance
module.exports = function execFileWrapper (cmd, userArgs, userOpts, userCallback) {
    if (!cmd) throw new Error('Cwd.execFile(): Command cannot be empty.');
    
    const [args, opts, callback] = this.resolveArguments(userArgs, userOpts, userCallback);

    return new Promise((resolve, reject) => {
        execFile(cmd, args, opts, (err, stdout, stderr) => {
            if (this.isBadCmd(cmd, err)) {
                const errMsg = getBadCmdLogMsg(cmd, args);
                const exception = new Error(errMsg);
                
                return reject(exception);
            }

            typeof callback == 'function' && callback(err, stdout, stderr);
            return resolve([err, stdout, stderr]);
        });
    });
};


function getBadCmdLogMsg (cmd, args) {
    return `
        \r  Cwd.execFile(cmd): Command not found

        \r      cmd: ${cmd}
        \r      args: [
        \r              ${args.join('\n\t      ')}
        \r            ]
    `;
}