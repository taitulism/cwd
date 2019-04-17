
const Cwd = require('./src/Cwd');

module.exports = function cwd (dirPath) {
	return new Cwd(dirPath);
};
