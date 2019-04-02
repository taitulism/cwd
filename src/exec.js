const { exec } = require('child_process');
const { existsSync } = require('fs');
const logAndDie = require('./_log-and-die');

// this === Cwd instance
module.exports = function execWrapper (...args) {
    const [cmd, cmdArgs, opts, callback] = this.resolveArguments(...args);
    
    if (!cmd) throw new Error('Cwd.execFile(): Command cannot be empty.');
    
    return new Promise((resolve, reject) => {
        execFile(cmd, args, opts, (err, stdout, stderr) => {
            if (this.isBadCmd(cmd, err)) {

                if (opts.cwd !== this.dirPath) {
                    const exists = existsSync(opts.cwd);

                    if (!exists) {
                        const errMsg = `\n
                            \r  Cwd.exec(options.cwd): Directory not found
                            \r      dir: ${opts.cwd}
                        `;

                        const exception = new Error(errMsg);
                        return reject(exception);
                    }
                }

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

                
    return `\n
        \r  Cwd.execFile(cmd): Command not found

        \r      cmd: ${cmd}
        \r      args: [${argsStr}]
        \r      opts: ${JSON.stringify(opts)}
    `;
}