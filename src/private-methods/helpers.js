const {existsSync} = require('fs');
const getLogMsg = require('./get-log-msg');

const helpers = {
	validateCommand (rawCmd) {
		const isValid = (typeof rawCmd === 'string') && rawCmd.length > 0;

		if (isValid) return;

		const errMsg = getLogMsg.emptyCmd();

		throw new Error(errMsg);
	},
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
