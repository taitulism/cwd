
const Cwd = require('./src/Cwd');

module.exports = function cwd (dirPath) {
    const cwdInstance = new Cwd(dirPath);

    return new Cwd(dirPath);
};
