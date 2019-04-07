const { exec, execFile } = require('child_process');
const { isBadCmd, isBadDirectory, getBadCmdLogMsg } = require('./helpers');

// this === Cwd instance
module.exports = function runCmd (...args) {
    const [cmd, cmdArgs, opts, callback, needShell] = this.resolveArguments(...args);

    if (!cmd) throw new Error('Cwd.runCmd(): Command cannot be empty.');

    return new Promise((resolve, reject) => {
        const execCallback = (err, stdout, stderr) => {
            if (isBadCmd(cmd, err)) {
                if (isBadDirectory(opts.cwd)) {
                    const errMsg = getBadDirLogMsg('runCmd', opts.cwd);
                    const exception = new Error(errMsg);
                    return reject(exception);
                }

                const errMsg = getBadCmdLogMsg('runCmd', cmd, cmdArgs, opts);
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
