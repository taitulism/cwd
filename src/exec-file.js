const { execFile } = require('child_process');
const logAndDie = require('./_log-and-die');

// this === Cwd instance
module.exports = function execFileWrapper (cmd, userArgs, userOpts, userCallback) {
    if (!cmd) throw new Error('Cwd.execFile(): Command cannot be empty.');
    
    const [args, opts, callback] = this.resolveArguments(userArgs, userOpts, userCallback);

    return new Promise((resolve, reject) => {
        execFile(cmd, args, opts, (err, stdout, stderr) => {
            console.log('exec err', err);
            if (this.isBadCmd(cmd, err)) {
                const errMsg = getBadCmdLogMsg(cmd, args, opts);
                const exception = new Error(errMsg);

                return reject(exception);
            }

            typeof callback == 'function' && callback(err, stdout, stderr);
            return resolve([err, stdout, stderr]);
        });
    });
};


function getBadCmdLogMsg (cmd, args, opts) {
    const argsLen = args.length;
    const argsStr = (argsLen === 0)
        ? ''
        : (argsLen === 1)
            ? ` ${args[0]} `
            : `
                \r\t\t${args.join('\n\t\t')}
                \r\t    `;

                
    return `
        \r  Cwd.execFile(cmd): Command not found

        \r      cmd: ${cmd}
        \r      args: [${argsStr}]
        \r      opts: ${JSON.stringify(opts)}
    `;
}