const LINE = 'line';
const DATA = 'data';
const STDOUT = 'stdout';
const STDERR = 'stderr';
const STDOUT_EVENT_NAME = 'stdOut';
const STDERR_EVENT_NAME = 'stdErr';
const STDOUT_LINE_EVENT_NAME = 'line/out';
const STDERR_LINE_EVENT_NAME = 'line/err';
const STDOUT_FLAGNAME = 'hasData';
const STDERR_FLAGNAME = 'hasErrors';

module.exports = {
	beforeClose (cp) {
		this.emitLastLines(cp);
		this.destroyChannels(cp);
	},

	destroyChannels (cp) {
		cp.stdout && cp.stdout.destroy();
		cp.stderr && cp.stderr.destroy();
	},

	emitLastLines (cp) {
		if (cp.stdout && cp.stdout.lineBuffer) {
			cp.emit(LINE, cp.stdout.lineBuffer);
			cp.emit(STDOUT_EVENT_NAME, [cp.stdout.lineBuffer]);
		}

		if (cp.stderr && cp.stderr.lineBuffer) {
			cp.emit(LINE, cp.stdout.lineBuffer);
			cp.emit(STDERR_EVENT_NAME, [cp.stderr.lineBuffer]);
		}
	},

	registerLineEvents (cp) {
		cp.stdout && registerLineEvent(cp, STDOUT);
		cp.stderr && registerLineEvent(cp, STDERR);
	},
};

function registerLineEvent (cp, channel) {
	let eventName, lineEventName, flagName;

	if (channel === STDOUT) {
		eventName = STDOUT_EVENT_NAME;
		lineEventName = STDOUT_LINE_EVENT_NAME;
		flagName = STDOUT_FLAGNAME;
	}
	else if (channel === STDERR) {
		eventName = STDERR_EVENT_NAME;
		lineEventName = STDERR_LINE_EVENT_NAME;
		flagName = STDERR_FLAGNAME;
	}
	// else {
	//     TODO:
	// }

	cp[flagName] = false;

	cp[channel].once(DATA, () => {
		cp[flagName] = true;
	});

	cp[channel].lineBuffer = '';

	cp[channel].setEncoding('utf8').on(DATA, (chunk) => {
		cp[channel].lineBuffer += chunk;

		/* eslint-disable-next-line newline-after-var */
		const lines = cp[channel].lineBuffer
			.split('\n')
			.map(line => line.trim())
			// TODO:
			// .filter(line => line !== '')
		;

		if (lines.length > 0) {
			const lastLine = lines.pop();

			cp[channel].lineBuffer = lastLine;
		}

		if (lines.length) {
			lines.forEach((line) => {
				cp.emit(lineEventName, line);
				cp.emit(LINE, line);
			});

			cp.emit(eventName, lines);
		}
	});
}
