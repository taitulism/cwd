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
			cp.emit('stdOut', [cp.stdout.lineBuffer]);
		}

		if (cp.stderr && cp.stderr.lineBuffer) {
			cp.emit('stdErr', [cp.stderr.lineBuffer]);
		}
	},

	registerLineEvents (cp) {
		cp.stdout && registerLineEvent(cp, 'stdout', 'stdOut', 'line/out', 'hasData');
		cp.stderr && registerLineEvent(cp, 'stderr', 'stdErr', 'line/err', 'hasErrors');
	},
};

function registerLineEvent (cp, channel, eventName, lineEventName, flagName) {
	cp[flagName] = false;

	cp[channel].once('data', () => {
		cp[flagName] = true;
	});

	cp[channel].lineBuffer = '';

	cp[channel].setEncoding('utf8').on('data', (chunk) => {
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
			});

			cp.emit(eventName, lines);
		}
	});
}
