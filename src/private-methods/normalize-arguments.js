const {ExpectedObject, ExpectedArray} = require('./errors');

module.exports = function normalizeArgs (maybeArgs, maybeOpts) {
	if (!maybeArgs && !maybeOpts) return [[], {}];

	if (maybeOpts && !isObject(maybeOpts)) {
		const errMsg = ExpectedObject(maybeOpts);

		throw new Error(errMsg);
	}

	let cmdArgs, options;

	if (!maybeArgs) {
		cmdArgs = [];
	}
	else if (isArray(maybeArgs)) {
		cmdArgs = maybeArgs;
	}
	else if (isStringOrNumber(maybeArgs)) {
		cmdArgs = [maybeArgs];
	}
	else if (isObject(maybeArgs) && !maybeOpts) {
		cmdArgs = [];
		options = maybeArgs;
	}
	else {
		const errMsg = ExpectedArray(maybeArgs);

		throw new Error(errMsg);
	}

	options = options || maybeOpts || {};

	return [cmdArgs, options];
};


function isArray (thing) {
	return Array.isArray(thing);
}

function isStringOrNumber (thing) {
	return typeof thing === 'string' || typeof thing === 'number';
}

function isObject (thing) {
	return thing !== null && Object.prototype.toString.call(thing) === '[object Object]';
}
