const CWD_ERR = 'Cwd Error';

module.exports = {
	CmdIsNotString: `${CWD_ERR}: The command must be a string.`,
	CmdIsEmptyString: `${CWD_ERR}: The command must be a non-empty string.`,
	ExpectedObject (opts) {
		const typeofOpts = typeof opts;

		return `${CWD_ERR}: Expecting 'options' to be an object. Got ${typeofOpts}`;
	},
	ExpectedArray (args) {
		const typeofArgs = typeof args;

		return `${CWD_ERR}: Expecting 'arguments' to be one of: array|string|number|null. Got ${typeofArgs}.`;
	},
};
