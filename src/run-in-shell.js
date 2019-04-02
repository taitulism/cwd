// const runCmd = require('./run-cmd');

module.exports = function runInShell (...args) {
    const [cmd, cmdArgs, opts, callback] = this.resolveArguments(...args);

    opts.shell = true;

    return this.runCmd(cmd, cmdArgs, opts, callback);
};