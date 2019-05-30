/* eslint-disable no-param-reassign */

const CR = '\r';
const LF = '\n';

module.exports = function removeTrailingCRLF (str) {
	if (str[str.length - 1] === LF) {
		str = str.substring(0, str.length - 1);
	}

	if (str[str.length - 1] === CR) {
		str = str.substring(0, str.length - 1);
	}

	return str;
};
