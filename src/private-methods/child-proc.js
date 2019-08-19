const STDOUT = 'stdout';
const STDERR = 'stderr';
const LINE_EVENT = 'line';
const STDOUT_LINE_EVENT = 'line/out';
const STDERR_LINE_EVENT = 'line/err';

module.exports = {
	beforeClose (cp) {
		this.emitLastLines(cp);

		if (cp.killed) {
			this.destroyChannels(cp);
		}
	},

	destroyChannels (cp) {
		cp.stdout && cp.stdout.destroy();
		cp.stderr && cp.stderr.destroy();
	},

	emitLastLines (cp) {
		if (cp.stdout && cp.stdout.lineBuffer) {
			cp.emit(STDOUT_LINE_EVENT, cp.stdout.lineBuffer);
			cp.emit(LINE_EVENT, cp.stdout.lineBuffer);
		}

		if (cp.stderr && cp.stderr.lineBuffer) {
			cp.emit(STDERR_LINE_EVENT, cp.stderr.lineBuffer);
			cp.emit(LINE_EVENT, cp.stderr.lineBuffer);
		}
	},

	registerLineEvents (cp) {
		cp.stdout && registerLineEvent(cp, STDOUT);
		cp.stderr && registerLineEvent(cp, STDERR);
	},
};

function registerLineEvent (cp, channel) {
	const channelLineEventName = (channel === STDOUT)
		? STDOUT_LINE_EVENT
		: STDERR_LINE_EVENT;

	cp[channel].lineBuffer = '';

	cp[channel].setEncoding('utf8').on('data', (chunk) => {
		cp[channel].lineBuffer += chunk;

		const lines = cp[channel].lineBuffer.split(/\r?\n/u);

		if (!lines.length) return;

		cp[channel].lineBuffer = lines.pop(); // last line

		lines.forEach((line) => {
			if (!line) return;

			cp.emit(channelLineEventName, line);
			cp.emit(LINE_EVENT, line);
		});
	});
}
