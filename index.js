
const Cwd = require('./src/Cwd');

const createCwd = dirPath => new Cwd(dirPath);
const defaultInstance = new Cwd();

createCwd.stdio = null;
createCwd.parentProcess = defaultInstance.parentProcess;

createCwd.spawn = (...args) => defaultInstance.spawn(...args);
createCwd.spawnShell = (...args) => defaultInstance.spawnShell(...args);
createCwd.runCmd = (...args) => defaultInstance.runCmd(...args);
createCwd.runShellCmd = (...args) => defaultInstance.runShellCmd(...args);

module.exports = createCwd;
