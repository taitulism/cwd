const { execFile } = require('child_process');

// this === Cwd instance
module.exports = function execFileWrapper (cmd, userArgs, userOpts, userCallback) {
    if (!cmd) {
        throw new Error('Cwd.execFile(): Command cannot be empty.')
    }
    
    const [args, opts, callback] = this.resolveArguments(userArgs, userOpts, userCallback);

    return new Promise((resolve, reject) => {
        try {
            const childProc = execFile(cmd, args, opts, callback)
                .on('error', err => {
                    console.log('childProc throwing...');
                    reject([
                        `Cwd.execFile\nCommand: ${cmd}\nArguments: ${args}\nDirectory:${this.dirPath}`,
                        err
                    ]);
                });
            
            return childProc;
        }
        catch (err) {
            console.log('cought!');
            reject([
                `Cwd.execFile\nCommand: ${cmd}\nArguments: ${args}\nDirectory:${this.dirPath}`,
                err
            ]);
        }
    });
};
