function isFunction (x) {
    return typeof x === 'function';
}

function isArray (x) {
    return Array.isArray(x);
}

function isObject (x) {
    return Object.prototype.toString.call(x) === '[object Object]';
}

function containsShellOperators (str) {
    return /[|&>;]/.test(str);
}

module.exports = function resolveArguments (userCmd, userArgs, userOpts, userCallback) {
    let cmd = null,
        cmdArgs = [],
        opts = null,
        defaultOpts = { cwd: this.dirPath },
        callback = null
        needShell = false;

    if (!userCmd) return [null];

    const cleanCmd = userCmd.trim().replace(/\s{2,}/g, ' ');

    if (!cleanCmd) return [null];

    if (containsShellOperators(cleanCmd)) {
        needShell = true;
    }

    if (needShell) {
        cmd = cleanCmd;
    }
    else {
        const cmdParts = cleanCmd.split(' ');

        cmd = cmdParts.shift();
        cmdArgs = cmdParts;
    }

    if (isArray(userArgs)) {
        if (needShell) {
            cmd += userArgs.join(' ');
        }
        else {
            cmdArgs = cmdArgs.concat(userArgs);
        }
    }

    if (isFunction(userCallback)) {
        callback = userCallback;
    }
    else if (isFunction(userOpts)) {
        callback = userOpts;
    }
    else if (isFunction(userArgs)) {
        callback = userArgs;
    }

    if (isObject(userOpts)) {
        opts = Object.assign({}, defaultOpts, userOpts);
    }
    else if (isObject(userArgs)) {
        opts = Object.assign({}, defaultOpts, userArgs);
    }

    opts = opts || defaultOpts;

    if (needShell && !opts.shell) {
        opts.shell = true;
    }

    return [cmd, cmdArgs, opts, callback];
}
