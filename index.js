
const Cwd = require('./src/Cwd');

module.exports = function createCwd (dirPath) {
	return new Cwd(dirPath);
};
