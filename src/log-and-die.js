const TAB = '   ';
const TAB2 = TAB + TAB;

const isMultiLine = (str) => /\n/.test(str);

module.exports = function logAndDie (msg, err) {
    if (Array.isArray(err)) {
        msg += '\n' + err[0];
        return logAndDie(msg, err[1]);
    }

    logException();
    logMessage(msg);

    if (err) {
        logErrMessage(err);
        emptyLine();

        err.stderr    && log(TAB, 'stderr:', err.stderr);
        err.cmd       && log(TAB, 'cmd:', `'${err.cmd}'`);
        err.stdout    && log(TAB, 'stdout:', err.stdout);
        err.code      && log(TAB, 'code:', err.code);
        err.errno     && log(TAB, 'errno:', err.errno);
        err.syscall   && log(TAB, 'syscall:', err.syscall);
        err.path      && log(TAB, 'path:', err.path);
        err.spawnargs && log(TAB, 'spawnargs:', err.spawnargs);
        
        emptyLine();
        log(err.stack);
    }

    emptyLine();

    process.exit(1);
};


function log (...args) {
    console.log(...args);
}

function logException () {
    emptyLines(2);
    console.log('Exception');
    console.log('─────────');
}

function logMessage (msg) {
    if (isMultiLine(msg)) {
        logMultiLineMsg(msg);
    }
    else {
        log(TAB, msg);
    }
}

function logErrMessage (err) {
    if (!err.message) return;

    const msg = err.message;

    if (isMultiLine(msg)) {
        logMultiLineMsg(msg);
    }
    else {
        log(TAB, msg);
    }

    removeErrMsg(err);
}

function removeErrMsg (err) {
    err.message = '';
}

function emptyLine (count = 1) {
    console.log('');
}

function emptyLines (count = 1) {
    while (count > 0) {
        emptyLine();
        count--;
    }
}

function logMultiLineMsg (rawMsg) {
    const msg = rawMsg.trim();
    const lines = msg.split('\n');

    const firstLine = lines.shift();
    console.log(TAB, firstLine);

    lines.forEach(line => {
        console.log(TAB2, line);
    });
}


