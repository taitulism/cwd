
const Cwd = require('./src/Cwd');

const cwdInstances = new Map();

module.exports = function cwd (dirPath) {
    if (cwdInstances.has(dirPath)) return cwdInstances.get(dirPath);

    const cwdInstance = new Cwd(dirPath);

    cwdInstances.set(dirPath, cwdInstance);

    return cwdInstance;
};
