module.exports = function runInShell (...args) {
    const [cmd, cmdArgs, opts] = this.resolveArguments(...args);

    opts.shell = true;

    return this.spawnProcess(cmd, cmdArgs, opts);
};
