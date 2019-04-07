module.exports = function runShellCmd (...args) {
    const [cmd, cmdArgs, opts, callback] = this.resolveArguments(...args);

    opts.shell = true;

    return this.runCmd(cmd, cmdArgs, opts, callback);
};
