const { expect } = require('chai');

const { TEST_DIR } = require('../constants');
const createCwd = require('../..');

module.exports = () => {
	let cwdInstance;
	beforeEach(() => { cwdInstance = createCwd(TEST_DIR) })
	afterEach(() => { cwdInstance = null })

	describe('When command is legit (e.g. `ls`)', () => {
		it('returns a native child_process', async () => {
			const returnValue = await cwdInstance.spawnProcess('ls');

			expect(returnValue).to.be.an('object');
			expect(Object.getPrototypeOf(returnValue).constructor.name).to.equal('ChildProcess');
		});

		describe('Event: stdOut', () => {
			it('event data is an array of strings (lines)', (done) => {
				const p = cwdInstance.spawnProcess('ls');

				let lines;

				p.on('stdOut', (linesAry) => {
					lines = linesAry;
				});

				p.on('close', () => {
					expect(lines).to.be.an('array');
					expect(lines[0]).to.be.a('string');
					done();
				})
			});

			it('holds the stdout text', (done) => {
				const p = cwdInstance.spawnProcess('ls');

				let stdoutBuffer = '';
				let stdOutLineBuffer = '';

				p.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				p.on('stdOut', (lines) => {
					stdOutLineBuffer += lines.join('\n') + '\n';
				});

				p.on('close', () => {
					// remove last newLine added above
					stdOutLineBuffer = stdOutLineBuffer.trimRight();

					expect(stdoutBuffer).to.have.string(stdOutLineBuffer);
					expect(stdoutBuffer).to.not.equal(stdOutLineBuffer);
					done();
				});
			});

			it('filters out empty lines', (done) => {
				const p = cwdInstance.spawnProcess('ls');

				let stdoutBuffer = '';
				let stdOutLines = [];

				p.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				p.on('stdOut', (lines) => {
					stdOutLines = stdOutLines.concat(lines);
				});

				p.on('close', () => {
					const stdoutBufferLines = stdoutBuffer.split('\n');

					expect(stdoutBufferLines).to.have.lengthOf(6);
					expect(stdoutBufferLines[5]).to.equal('');

					expect(stdOutLines).to.have.lengthOf(5);
					expect(stdOutLines[4]).to.not.equal('');
					done();
				});
			});
		});

		describe('Event: stdErr', () => {
			it('event data is an array of strings (lines)', (done) => {
				const p = cwdInstance.spawnProcess('ls ./bla');

				let lines;

				p.on('stdErr', (linesAry) => {
					lines = linesAry;
				});

				p.on('close', () => {
					expect(lines).to.be.an('array');
					expect(lines[0]).to.be.a('string');
					done();
				})
			});

			it('holds the stderr text', (done) => {
				const p = cwdInstance.spawnProcess('ls ./bla');

				let stderrBuffer = '';
				let stdErrLineBuffer = '';

				p.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				p.on('stdErr', (lines) => {
					stdErrLineBuffer += '\n' + lines.join('\n');
					stdErrLineBuffer = stdErrLineBuffer.trim();
				});

				p.on('close', () => {
					expect(stderrBuffer).to.have.string(stdErrLineBuffer);
					expect(stderrBuffer).to.not.equal(stdErrLineBuffer);
					done();
				});
			});

			it('filters out empty lines', (done) => {
				const p = cwdInstance.spawnProcess('ls ./bla');

				let stderrBuffer = '';
				let stdErrLines = [];

				p.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				p.on('stdErr', (lines) => {
					stdErrLines = stdErrLines.concat(lines);
				});

				p.on('close', () => {
					const stdoutBufferLines = stderrBuffer.split('\n');

					expect(stdoutBufferLines).to.have.lengthOf(2);
					expect(stdoutBufferLines[1]).to.equal('');

					expect(stdErrLines).to.have.lengthOf(1);
					expect(stdErrLines[0]).to.not.equal('');
					done();
				});
			});
		});
	});

	describe('When called without arguments', () => {
		it('throws an error', () => {
			const shouldThrow = () => {
				return cwdInstance.spawnProcess();
			};

			expect(shouldThrow).to.throw('First argument (cmd) must be a string')
		});
	});

	describe('When called with a command that doesn\'t exist (e.g. `bla`)', () => {
		it('emits an error event', (done) => {
			cwdInstance.spawnProcess('bla').on('error', (err) => {
				expect(err).to.be.an.instanceof(Error);
				expect(err.message).to.have.string('bla ENOENT');
				done();
			});
		});
	});
};
