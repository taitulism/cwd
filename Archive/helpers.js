const {existsSync} = require('fs');

const helpers = {
	isBadCmd (cmd, err) {
		if (!err) return false;

		return err.message.startsWith(`spawn ${cmd} ENOENT`);
	},

	isBadDirectory (dirPath) {
		const exists = existsSync(dirPath);

		return !exists;
	},
};

module.exports = helpers;
