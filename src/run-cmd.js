const { exec, execFile } = require('child_process');
const { existsSync } = require('fs');
const logAndDie = require('./_log-and-die');

// this === Cwd instance
module.exports = function runCmd (...args) {
    const [cmd, cmdArgs, opts, callback, needShell] = this.resolveArguments(...args);
    
    if (!cmd) throw new Error('Cwd.runCmd(): Command cannot be empty.');

    return new Promise((resolve, reject) => {
        const execCallback = (err, stdout, stderr) => {
            if (this.isBadCmd(cmd, err)) {

                if (opts.cwd !== this.dirPath) {
                    const exists = existsSync(opts.cwd);

                    if (!exists) {
                        const errMsg = `\n
                            \r  Cwd.runCmd(options.cwd): Directory not found
                            \r      dir: ${opts.cwd}
                        `;

                        const exception = new Error(errMsg);
                        return reject(exception);
                    }
                }

                const errMsg = this.getBadCmdLogMsg(cmd, cmdArgs, opts);
                const exception = new Error(errMsg);

                return reject(exception);
            }

            typeof callback == 'function' && callback(err, stdout, stderr);
            return resolve([err, stdout, stderr]);
        };

        (needShell)
            ? exec(cmd, opts, execCallback)
            : execFile(cmd, cmdArgs, opts, execCallback);
    });
};
