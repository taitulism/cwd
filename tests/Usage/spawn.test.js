const {expect} = require('chai');
const sinon = require('sinon');

const {TEST_DIR, OTHER_TEST_DIR} = require('../constants');
const createCwd = require('../..');

module.exports = () => {
	let cwdInstance;

	beforeEach(() => {
		cwdInstance = createCwd(TEST_DIR);
	});

	afterEach(() => {
		cwdInstance = null;
	});

	describe('When command is legit (e.g. `ls`)', () => {
		it('returns a native child_process', async () => {
			const returnValue = await cwdInstance.spawn('ls');
			const constructorName = Object.getPrototypeOf(returnValue).constructor.name;

			expect(returnValue).to.be.an('object');
			expect(constructorName).to.equal('ChildProcess');
		});

		describe('Event: stdOut', () => {
			it('event data is an array of strings (lines)', (done) => {
				const childProc = cwdInstance.spawn('ls');

				let lines;

				childProc.on('stdOut', (linesAry) => {
					lines = linesAry;
				});

				childProc.on('close', () => {
					expect(lines).to.be.an('array');
					expect(lines[0]).to.be.a('string');
					done();
				});
			});

			it('holds the stdout text', (done) => {
				const childProc = cwdInstance.spawn('ls');

				let stdoutBuffer = '';
				let stdOutLineBuffer = '';

				childProc.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				childProc.on('stdOut', (lines) => {
					stdOutLineBuffer += `${lines.join('\n')}\n`;
				});

				childProc.on('close', () => {
					// remove last newLine added above
					stdOutLineBuffer = stdOutLineBuffer.trimRight();

					expect(stdoutBuffer).to.have.string(stdOutLineBuffer);
					expect(stdoutBuffer).to.not.equal(stdOutLineBuffer);
					done();
				});
			});

			it('filters out empty lines', (done) => {
				const childProc = cwdInstance.spawn('ls');

				let stdoutBuffer = '';

				childProc.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				let stdOutLines = [];

				childProc.on('stdOut', (lines) => {
					stdOutLines = stdOutLines.concat(lines);
				});

				childProc.on('close', () => {
					const bufferLines = stdoutBuffer.split('\n');

					expect(bufferLines).to.have.lengthOf(4);
					expect(bufferLines[3]).to.equal('');

					expect(stdOutLines).to.have.lengthOf(3);
					expect(stdOutLines[2]).to.not.equal('');
					done();
				});
			});
		});

		describe('Event: stdErr', () => {
			it('event data is an array of strings (lines)', (done) => {
				const childProc = cwdInstance.spawn('ls ./bla');

				let lines;

				childProc.on('stdErr', (linesAry) => {
					lines = linesAry;
				});

				childProc.on('close', () => {
					expect(lines).to.be.an('array');
					expect(lines[0]).to.be.a('string');
					done();
				});
			});

			it('holds the stderr text', (done) => {
				const childProc = cwdInstance.spawn('ls ./bla');

				let stderrBuffer = '';
				let stdErrLineBuffer = '';

				childProc.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				childProc.on('stdErr', (lines) => {
					stdErrLineBuffer += `\n${lines.join('\n')}`;
					stdErrLineBuffer = stdErrLineBuffer.trim();
				});

				childProc.on('close', () => {
					expect(stderrBuffer).to.have.string(stdErrLineBuffer);
					expect(stderrBuffer).to.not.equal(stdErrLineBuffer);
					done();
				});
			});

			it('filters out empty lines', (done) => {
				const childProc = cwdInstance.spawn('ls ./bla');

				let stderrBuffer = '';
				let stdErrLines = [];

				childProc.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				childProc.on('stdErr', (lines) => {
					stdErrLines = stdErrLines.concat(lines);
				});

				childProc.on('close', () => {
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

	describe('When detected shell opertaors ("|", "&", ">", ";")', () => {
		describe('Inside the command', () => {
			it('automatically spawns a shell', (done) => {
				const spy = sinon.spy(Object.getPrototypeOf(cwdInstance), '_spawn');

				cwdInstance.spawn('ls && echo hi')
					.on('close', () => {
						expect(spy.callCount).to.equal(1);
						expect(spy.firstCall.args).to.have.lengthOf(3);
						expect(spy.firstCall.args[2]).to.be.an('object');
						expect(spy.firstCall.args[2].shell).to.be.true;
						spy.restore();
						done();
					});
			});
		});

		describe('In on of the command\'s arguments', () => {
			it('automatically spawns a shell', (done) => {
				const spy = sinon.spy(Object.getPrototypeOf(cwdInstance), '_spawn');

				cwdInstance.spawn('ls', ['&& echo hi'])
					.on('close', () => {
						expect(spy.callCount).to.equal(1);
						expect(spy.firstCall.args).to.have.lengthOf(3);
						expect(spy.firstCall.args[2]).to.be.an('object');
						expect(spy.firstCall.args[2].shell).to.be.true;
						spy.restore();
						done();
					});
			});
		});
	});

	describe('When called with spawn options', () => {
		it('overrides default cwd', (done) => {
			let bufferedLines = [];

			cwdInstance.spawn('ls', {cwd: OTHER_TEST_DIR})
				.on('stdOut', (lines) => {
					bufferedLines = bufferedLines.concat(lines);
				})
				.on('close', () => {
					expect(bufferedLines).to.include('other-aaa');
					expect(bufferedLines).to.include('other-bbb');
					expect(bufferedLines).to.include('other-ccc');
					done();
				});
		});

		it('overrides default cwd (with cmd args)', (done) => {
			let bufferedLines = [];

			cwdInstance.spawn('ls', ['./'], {cwd: OTHER_TEST_DIR})
				.on('stdOut', (lines) => {
					bufferedLines = bufferedLines.concat(lines);
				})
				.on('close', () => {
					expect(bufferedLines).to.include('other-aaa');
					expect(bufferedLines).to.include('other-bbb');
					expect(bufferedLines).to.include('other-ccc');
					done();
				});
		});

		it('overrides default cwd (with `null` as cmd args)', (done) => {
			let bufferedLines = [];

			cwdInstance.spawn('ls', null, {cwd: OTHER_TEST_DIR})
				.on('stdOut', (lines) => {
					bufferedLines = bufferedLines.concat(lines);
				})
				.on('close', () => {
					expect(bufferedLines).to.include('other-aaa');
					expect(bufferedLines).to.include('other-bbb');
					expect(bufferedLines).to.include('other-ccc');
					done();
				});
		});
	});

	describe('When called without arguments', () => {
		it('throws an error', () => {
			const shouldThrow = () => cwdInstance.spawn();

			expect(shouldThrow).to.throw('First argument (cmd) must be a string');
		});
	});

	describe('When called with a command that doesn\'t exist (e.g. `bla`)', () => {
		it('emits an error event', (done) => {
			cwdInstance.spawn('bla').on('error', (err) => {
				expect(err).to.be.an.instanceof(Error);
				expect(err.message).to.have.string('bla ENOENT');
				done();
			});
		});
	});
};
