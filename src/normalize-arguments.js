
module.exports = function normalizeArgs (maybeArgs, maybeOptions) {
	if (!maybeArgs) {
		return [[], {}]
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
			throw new Error('Cwd.spawnProcess() - Command arguments must be an array');
		}
		if (!isObject(maybeOptions)) {
			throw new Error('Cwd.spawnProcess() - Spawn options must be an object');
		}
	}

	// only 1 argument
	if (isArray(maybeArgs)) {
		return [maybeArgs, {}];
	}

	if (isObject(maybeArgs)) {
		return [[], maybeArgs];
	}

	throw new Error(`Cwd.spawnProcess() - Expecting an array or an object. Got: ${maybeArgs}`);
}



function isArray (x) {
    return Array.isArray(x);
}

function isObject (x) {
    return Object.prototype.toString.call(x) === '[object Object]';
}
