/* eslint-disable max-statements */

const errTitle = 'Cwd.spawn() -';

module.exports = function normalizeArgs (maybeArgs, maybeOptions) {
	if (!maybeArgs) {
		return [[], {}];
	}

	if (maybeOptions) {
		if (isArray(maybeArgs) && isObject(maybeOptions)) {
			return [maybeArgs, maybeOptions];
		}

		if (isArray(maybeOptions) && isObject(maybeArgs)) {
			return [maybeOptions, maybeArgs];
		}

		// Bad Args
		if (!isArray(maybeArgs)) {
			throw new Error(`${errTitle} Command arguments must be an array`);
		}
		if (!isObject(maybeOptions)) {
			throw new Error(`${errTitle} Spawn options must be an object`);
		}
	}

	// only 1 argument
	if (isArray(maybeArgs)) {
		return [maybeArgs, {}];
	}

	if (isObject(maybeArgs)) {
		return [[], maybeArgs];
	}

	const errMsg = `${errTitle} Expecting an array or an object. Got: ${maybeArgs}`;

	throw new Error(errMsg);
};



function isArray (thing) {
	return Array.isArray(thing);
}

function isObject (thing) {
	return Object.prototype.toString.call(thing) === '[object Object]';
}
