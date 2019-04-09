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

			it('emitted on regular stdout', (done) => {
				const p = cwdInstance.spawnProcess('ls');

				let stdoutCount = 0;
				let stdOutLineCount = 0;

				p.stdout.on('data', () => {
					stdoutCount++;
				});

				p.on('stdOut', () => {
					stdOutLineCount++
				});

				p.on('close', () => {
					expect(stdOutLineCount).to.equal(stdoutCount);
					done();
				})
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

			it('emitted on regular stdout', (done) => {
				const p = cwdInstance.spawnProcess('ls ./bla');

				let stderrCount = 0;
				let stdErrLineCount = 0;

				p.stderr.on('data', () => {
					stderrCount++;
				});

				p.on('stdErr', () => {
					stdErrLineCount++
				});

				p.on('close', () => {
					expect(stdErrLineCount).to.equal(stderrCount);
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
