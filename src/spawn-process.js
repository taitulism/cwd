const { spawn } = require('child_process');
const { isBadCmd, getBadCmdLogMsg, isBadDirectory } = require('./helpers');

module.exports = function spawnProcess (...args) {
    const [cmd, cmdArgs, opts, needShell] = this.resolveArguments(...args);
    
    if (!cmd) throw new Error('Cwd.spawnProcess(): Command cannot be empty.');

    const childProc = spawn(cmd, cmdArgs, opts)
    
    // childProc.on('error', err => {
    //     if (isBadCmd(cmd, err)) {
    //         if (isBadDirectory(opts, this.dirPath)) {
    //             const errMsg = `\n
    //                 \r  Cwd.spawnProcess(options.cwd): Directory not found
    //                 \r      dir: ${opts.cwd}
    //             `;

    //             const exception = new Error(errMsg);
    //             throw exception;
    //         }

    //         const errMsg = getBadCmdLogMsg(cmd, cmdArgs, opts);
    //         const exception = new Error(errMsg);

    //         throw exception;
    //     }

    //     throw err;
    // });

    if (childProc.stdout)
        registerLinesEvent(childProc, 'stdout', 'stdOut', 'hasData');
    
    if (childProc.stderr)
        registerLinesEvent(childProc, 'stderr', 'stdErr', 'hasErrors');

    return childProc;
}

function registerLinesEvent (proc, channel, eventName, flagName) {
    proc[flagName] = false;
    proc[channel].once('data', (chunk) => {
        proc[flagName] = true;
    });
    
    let lineBuffer = '';
    proc[channel].setEncoding('utf8').on('data', (chunk) => {
        lineBuffer += chunk;
        
        const lines = lineBuffer.split('\n');
        const lastLine = lines.pop();
        
        proc.emit(eventName, lines.filter(line => line != ''));

        lineBuffer = lastLine;
    });
};
