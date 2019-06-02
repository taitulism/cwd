/* eslint-disable no-shadow, max-lines */

const {EOL} = require('os');
const {expect} = require('chai');

const {TEST_DIR, OTHER_TEST_DIR} = require('../constants');
const errors = require('../../src/private-methods/errors');
const Cwd = require('../..');

module.exports = () => {
	let cwd;

	beforeEach(() => {
		cwd = new Cwd(TEST_DIR);
	});

	afterEach(() => {
		cwd = null;
	});

	describe('When command is legit (e.g. `ls`)', () => {
		it('returns a native child_process', async () => {
			const returnValue = await cwd.spawn('ls');
			const constructorName = Object.getPrototypeOf(returnValue).constructor.name;

			expect(returnValue).to.be.an('object');
			expect(constructorName).to.equal('ChildProcess');
		});

		describe('Event: line', () => {
			it('event data is a string (for each stdout & stderr line)', (done) => {
				const file = '../helper-processes/out-and-err.js';

				const childProc = cwd.spawn(`node ${file}`);
				let count = 0;

				childProc.on('line', (line) => {
					count++;
					expect(line).to.be.a('string');
				});

				childProc.on('close', () => {
					expect(count).to.equal(4);
					done();
				});
			});

			it('holds a single line of text from either stdout or stderr', (done) => {
				const childProc = cwd.spawn('ls');

				let stdoutBuffer = '';
				const lineOutArray = [];

				childProc.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				childProc.on('line', (line) => {
					lineOutArray.push(line);
				});

				childProc.on('close', () => {
					lineOutArray.forEach((line) => {
						expect(stdoutBuffer).to.have.string(line);
					});

					expect(stdoutBuffer.trimRight().split('\n')).to.eql(lineOutArray);
					done();
				});
			});

			it('discards empty lines', (done) => {
				const file = '../helper-processes/output-empty-lines.js';

				const childProc = cwd.spawn(`node ${file}`);

				let stdoutBuffer = '';
				const lines = [];

				childProc.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				childProc.on('line', (line) => {
					lines.push(line);
				});

				childProc.on('close', () => {
					// test the native stdout string for reference
					const splitBuffer = stdoutBuffer.split(EOL);

					expect(splitBuffer).to.have.lengthOf(8);

					let EOLCount = 0;

					splitBuffer.forEach((line) => {
						!line && EOLCount++;
					});

					expect(EOLCount).to.equal(4);

					// test lines
					expect(lines).to.have.lengthOf(4);

					EOLCount = 0;

					lines.forEach((line) => {
						!line && EOLCount++;
					});

					expect(EOLCount).to.equal(0);

					done();
				});
			});
		});

		describe('Event: \'line/out\'', () => {
			it('event data is a string (for each stdout single line)', (done) => {
				const childProc = cwd.spawn('ls');
				let count = 0;

				childProc.on('line/out', (line) => {
					count++;
					expect(line).to.be.a('string');
				});

				childProc.on('close', () => {
					expect(count).to.equal(3);
					done();
				});
			});

			it('holds an stdout single line of text', (done) => {
				const childProc = cwd.spawn('ls');

				let stdoutBuffer = '';
				const lineOutArray = [];

				childProc.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				childProc.on('line/out', (line) => {
					lineOutArray.push(line);
				});

				childProc.on('close', () => {
					lineOutArray.forEach((line) => {
						expect(stdoutBuffer).to.have.string(line);
					});

					expect(stdoutBuffer.trimRight().split(/\r?\n/u)).to.eql(lineOutArray);
					done();
				});
			});
		});

		describe('Event: \'line/err\'', () => {
			it('event data is a string (for each stderr single line)', (done) => {
				const childProc = cwd.spawn('ls', ['./bla']);
				let count = 0;

				childProc.on('line/err', (line) => {
					count++;
					expect(line).to.be.a('string');
				});

				childProc.on('close', () => {
					expect(count).to.equal(1);
					done();
				});
			});

			it('holds an stderr single line of text', (done) => {
				const childProc = cwd.spawn('ls', ['./bla']);

				let stderrBuffer = '';
				const lineErrArray = [];

				childProc.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				childProc.on('line/err', (line) => {
					lineErrArray.push(line);
				});

				childProc.on('close', () => {
					lineErrArray.forEach((line) => {
						expect(stderrBuffer).to.have.string(line);
					});

					expect(stderrBuffer.trimRight().split('\n')).to.eql(lineErrArray);
					done();
				});
			});
		});

		describe('Event: stdOut', () => {
			it('event data is an array of strings (lines)', (done) => {
				const childProc = cwd.spawn('ls');

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
				const childProc = cwd.spawn('ls');

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
				const childProc = cwd.spawn('ls');

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
				const childProc = cwd.spawn('ls ./bla');

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
				const childProc = cwd.spawn('ls ./bla');

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
				const childProc = cwd.spawn('ls ./bla');

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

	describe('When called with spawn options', () => {
		it('overrides default cwd', (done) => {
			let bufferedLines = [];

			cwd.spawn('ls', {cwd: OTHER_TEST_DIR})
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

			cwd.spawn('ls', ['./'], {cwd: OTHER_TEST_DIR})
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

			cwd.spawn('ls', null, {cwd: OTHER_TEST_DIR})
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
			const shouldThrow = () => cwd.spawn();

			expect(shouldThrow).to.throw(errors.CmdIsNotString);
		});
	});

	describe('When called with a command argument that is string', () => {
		it('works', (done) => {
			const MY_ARG = 'myArg';
			const file = '../helper-processes/return-called-with.js';

			cwd.spawn(`node ${file}`, MY_ARG)
				.on('line', (line) => {
					expect(line).to.equal(MY_ARG);
					done();
				});
		});
	});

	describe('When called with a command argument that is number', () => {
		it('works', (done) => {
			const MY_ARG = 42;
			const file = '../helper-processes/return-called-with.js';

			cwd.spawn(`node ${file}`, MY_ARG)
				.on('line', (line) => {
					expect(line).to.equal(MY_ARG.toString());
					done();
				});
		});
	});

	describe('When called with a command that doesn\'t exist (e.g. `bla`)', () => {
		it('emits an error event', (done) => {
			cwd.spawn('bla').on('error', (err) => {
				expect(err).to.be.an.instanceof(Error);
				expect(err.message).to.have.string('bla ENOENT');
				done();
			});
		});
	});

	describe('When cwd doesn\'t exist (e.g. ``)', () => {
		it('emits an error event', (done) => {
			const cwd = new Cwd('../not/exist');

			cwd.spawn('ls').on('error', (err) => {
				expect(err).to.be.an.instanceof(Error);
				expect(err.code).to.equal('ENOENT');
				done();
			});
		});
	});
};
