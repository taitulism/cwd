/* eslint-disable max-statements */

const getLogMsg = require('./get-log-msg');

module.exports = function normalizeArgs (maybeArgs, maybeOptions) {
	// neither
	if (!maybeArgs && !maybeOptions) return [[], {}];

	// both
	if (maybeArgs && maybeOptions) {
		if (isArray(maybeArgs) && isObject(maybeOptions)) {
			return [maybeArgs, maybeOptions];
		}

		if (isArray(maybeOptions) && isObject(maybeArgs)) {
			return [maybeOptions, maybeArgs];
		}

		const errMsg = getLogMsg.expectedTypes(maybeArgs, maybeOptions);

		throw new Error(errMsg);
	}

	const cmdArgs = [];
	const options = {};

	// only one
	if (maybeArgs) {
		if (isArray(maybeArgs)) {
			cmdArgs.push(...maybeArgs);
		}
		else if (isObject(maybeArgs)) {
			Object.assign(options, maybeArgs);
		}
	}
	else if (maybeOptions) {
		if (isArray(maybeOptions)) {
			cmdArgs.push(...maybeOptions);
		}
		else if (isObject(maybeOptions)) {
			Object.assign(options, maybeOptions);
		}
	}

	return [cmdArgs, options];
};



function isArray (thing) {
	return Array.isArray(thing);
}

function isObject (thing) {
	return Object.prototype.toString.call(thing) === '[object Object]';
}
