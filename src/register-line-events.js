module.exports = registerLineEvents;

function registerLineEvents (childProc) {
	childProc.stdout && registerLineEvent(childProc, 'stdout', 'stdOut', 'hasData');
	childProc.stderr && registerLineEvent(childProc, 'stderr', 'stdErr', 'hasErrors');
}

function registerLineEvent (childProc, channel, eventName, flagName) {
	childProc[flagName] = false;

	childProc[channel].once('data', () => {
		childProc[flagName] = true;
	});

	childProc[channel].lineBuffer = '';

	childProc[channel].setEncoding('utf8').on('data', (chunk) => {
		childProc[channel].lineBuffer += chunk;

		/* eslint-disable-next-line newline-after-var */
		const lines = childProc[channel].lineBuffer
			.split('\n')
			.map(line => line.trim())
			// TODO:
			// .filter(line => line !== '')
		;

		if (lines.length > 0) {
			const lastLine = lines.pop();

			childProc[channel].lineBuffer = lastLine;
		}

		lines.length && childProc.emit(eventName, lines);
	});
}
