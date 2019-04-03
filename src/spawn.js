const {spawn} = require('child_process');

module.exports = function spawnProcess (...args) {
    const [cmd, cmdArgs, opts, callback, needShell] = this.resolveArguments(...args);
    
    if (!cmd) throw new Error('Cwd.spawnProcess(): Command cannot be empty.');

    return new Promise((resolve, reject) => {
        const childProc = spawn(cmd, cmdArgs, opts, execCallback).on('error', err => {
            if (this.isBadCmd(cmd, err)) {

                if (opts.cwd !== this.dirPath) {
                    const exists = existsSync(opts.cwd);

                    if (!exists) {
                        const errMsg = `\n
                            \r  Cwd.spawnProcess(options.cwd): Directory not found
                            \r      dir: ${opts.cwd}
                        `;

                        const exception = new Error(errMsg);
                        return reject(exception);
                    }
                }

                const errMsg = getBadCmdLogMsg(cmd, cmdArgs, opts);
                const exception = new Error(errMsg);

                return reject(exception);
            }

            console.log('childProc onError throwing...');
            reject([
                `Cwd.spawnProcess\nCommand: ${cmd}\nArguments: ${args}\nDirectory:${this.dirPath}`,
                err
            ]);
        });

        // replace api:
        //    lineifyChannel(childProc, 'stderr')
        childProc.stdout.on('data', getChannelLines(childProc, 'stdout'));
        childProc.stderr.on('data', getChannelLines(childProc, 'stderr'));

        return resolve([err, stdout, stderr]);
    });
}

function getChannelLines (proc, channel) {
    proc[channel].setEncoding('utf8');

    let lineBuffer = '';
    
    return function chunkHandler (chunk) {
        lineBuffer += chunk;
        
        const lines = lineBuffer.split('\n');
        const lastLine = lines.pop();
        
        proc.emit(`${channel}/lines`, lines.filter(line => line != ''));

        lineBuffer = lastLine;
    };
};