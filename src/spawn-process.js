const {spawn} = require('child_process');

module.exports = function spawnProcess (...args) {
    const [cmd, cmdArgs, opts, callback, needShell] = this.resolveArguments(...args);
    
    if (!cmd) throw new Error('Cwd.spawnProcess(): Command cannot be empty.');

    const childProc = spawn(cmd, cmdArgs, opts)
    
    childProc.on('error', err => {
        if (this.isBadCmd(cmd, err)) {
            if (isBadDirectory(opts, this.dirPath)) {
                const errMsg = `\n
                    \r  Cwd.spawnProcess(options.cwd): Directory not found
                    \r      dir: ${opts.cwd}
                `;

                const exception = new Error(errMsg);
                throw exception;
            }

            const errMsg = this.getBadCmdLogMsg(cmd, cmdArgs, opts);
            const exception = new Error(errMsg);
            throw exception;
        }

        throw err;
    });

    registerLinesEvent(childProc, 'stdout', 'stdOut', 'hasData');
    registerLinesEvent(childProc, 'stderr', 'stdErr', 'hasErrors');

    return childProc;
}

function registerLinesEvent (proc, channel, eventName, flagName) {
    let lineBuffer = '';

    proc[flagName] = false;
    proc[channel].once('data', (chunk) => {
        proc[flagName] = true;
    });

    proc[channel].setEncoding('utf8').on('data', (chunk) => {
        lineBuffer += chunk;
        
        const lines = lineBuffer.split('\n');
        const lastLine = lines.pop();
        
        proc.emit(eventName, lines.filter(line => line != ''));

        lineBuffer = lastLine;
    });
};

function isBadDirectory (opts, dirPath) {
    if (opts.cwd === dirPath) return false;

    const exists = existsSync(opts.cwd);

    return !exists;
}
