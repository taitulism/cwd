/* eslint-disable no-shadow, max-lines */

const {EOL} = require('os');
const {expect} = require('chai');

const {TEST_DIR, OTHER_TEST_DIR} = require('../constants');
const errors = require('../../src/private-methods/errors');
const createCwd = require('../..');

module.exports = () => {
	let cwd;

	beforeEach(() => {
		cwd = createCwd(TEST_DIR);
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
				const file = '../helper-processes/out-and-err-empty-lines.js';
				const childProc = cwd.spawn(`node ${file}`);

				const lines = [];
				childProc.on('line', (line) => {
					lines.push(line);
				});

				// use both native streams for reference
				let stdBuffer = '';
				// stdout
				childProc.stdout.on('data', (chunk) => {
					stdBuffer += chunk;
				});
				// stderr
				childProc.stderr.on('data', (chunk) => {
					stdBuffer += chunk;
				});

				childProc.on('close', () => {
					const splitBuffer = stdBuffer.split(EOL);

					expect(splitBuffer).to.have.lengthOf(9);

					let emptyLines = 0;
					splitBuffer.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(5);
					expect(lines).to.have.lengthOf(4);

					emptyLines = 0;
					lines.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(0);

					done();
				});
			});

			it('emits last line', (done) => {
				const file = '../helper-processes/out-and-err-last-line.js';
				const childProc = cwd.spawn(`node ${file}`);

				const lines = [];
				childProc.on('line', (line) => {
					lines.push(line);
				});

				let stdBuffer = '';
				childProc.stdout.on('data', (chunk) => {
					stdBuffer += chunk;
				});
				childProc.stderr.on('data', (chunk) => {
					stdBuffer += chunk;
				});

				childProc.on('close', () => {
					// test the native stderr string for reference
					const splitBuffer = stdBuffer.split(EOL);

					expect(splitBuffer).to.have.lengthOf(7);

					let emptyLines = 0;
					splitBuffer.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(3);
					expect(lines).to.have.lengthOf(4);

					emptyLines = 0;
					lines.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(0);

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

			it('discards empty lines', (done) => {
				const file = '../helper-processes/out-and-err-empty-lines.js';
				const childProc = cwd.spawn(`node ${file} stdout`);

				const lines = [];
				childProc.on('line/out', (line) => {
					lines.push(line);
				});

				let stdoutBuffer = '';
				childProc.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				childProc.on('close', () => {
					// test the native stdout string for reference
					const splitBuffer = stdoutBuffer.split(EOL);

					expect(splitBuffer).to.have.lengthOf(9);

					let emptyLines = 0;
					splitBuffer.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(5);
					expect(lines).to.have.lengthOf(4);

					emptyLines = 0;
					lines.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(0);

					done();
				});
			});

			it('emits last line', (done) => {
				const file = '../helper-processes/out-and-err-last-line.js';
				const childProc = cwd.spawn(`node ${file} stdout`);

				const lines = [];
				childProc.on('line/out', (line) => {
					lines.push(line);
				});

				let stdoutBuffer = '';
				childProc.stdout.on('data', (chunk) => {
					stdoutBuffer += chunk;
				});

				childProc.on('close', () => {
					// test the native stderr string for reference
					const splitBuffer = stdoutBuffer.split(EOL);

					expect(splitBuffer).to.have.lengthOf(7);

					let emptyLines = 0;
					splitBuffer.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(3);
					expect(lines).to.have.lengthOf(4);

					emptyLines = 0;
					lines.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(0);

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
				const errLines = [];

				childProc.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				childProc.on('line/err', (line) => {
					errLines.push(line);
				});

				childProc.on('close', () => {
					errLines.forEach((line) => {
						expect(stderrBuffer).to.have.string(line);
					});

					expect(stderrBuffer.trimRight().split('\n')).to.eql(errLines);
					done();
				});
			});

			it('discards empty lines', (done) => {
				const file = '../helper-processes/out-and-err-empty-lines.js';
				const childProc = cwd.spawn(`node ${file} stderr`);

				const lines = [];
				childProc.on('line/err', (line) => {
					lines.push(line);
				});

				let stderrBuffer = '';
				childProc.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				childProc.on('close', () => {
					// test the native stderr string for reference
					const splitBuffer = stderrBuffer.split(EOL);

					expect(splitBuffer).to.have.lengthOf(9);

					let emptyLines = 0;
					splitBuffer.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(5);
					expect(lines).to.have.lengthOf(4);

					emptyLines = 0;
					lines.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(0);

					done();
				});
			});

			it('emits last line', (done) => {
				const file = '../helper-processes/out-and-err-last-line.js';
				const childProc = cwd.spawn(`node ${file} stderr`);

				const lines = [];
				childProc.on('line/err', (line) => {
					lines.push(line);
				});

				let stderrBuffer = '';
				childProc.stderr.on('data', (chunk) => {
					stderrBuffer += chunk;
				});

				childProc.on('close', () => {
					// test the native stderr string for reference
					const splitBuffer = stderrBuffer.split(EOL);

					expect(splitBuffer).to.have.lengthOf(7);

					let emptyLines = 0;
					splitBuffer.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(3);
					expect(lines).to.have.lengthOf(4);

					emptyLines = 0;
					lines.forEach((line) => {
						!line && emptyLines++;
					});

					expect(emptyLines).to.equal(0);

					done();
				});
			});
		});
	});

	describe('When called with spawn options', () => {
		it('overrides default cwd', (done) => {
			const bufferedLines = [];

			cwd.spawn('ls', {cwd: OTHER_TEST_DIR})
				.on('line/out', (line) => {
					bufferedLines.push(line);
				})
				.on('close', () => {
					expect(bufferedLines).to.include('other-aaa');
					expect(bufferedLines).to.include('other-bbb');
					expect(bufferedLines).to.include('other-ccc');
					done();
				});
		});

		it('overrides default cwd (with cmd args)', (done) => {
			const bufferedLines = [];

			cwd.spawn('ls', ['./'], {cwd: OTHER_TEST_DIR})
				.on('line/out', (line) => {
					bufferedLines.push(line);
				})
				.on('close', () => {
					expect(bufferedLines).to.include('other-aaa');
					expect(bufferedLines).to.include('other-bbb');
					expect(bufferedLines).to.include('other-ccc');
					done();
				});
		});

		it('overrides default cwd (with `null` as cmd args)', (done) => {
			const bufferedLines = [];

			cwd.spawn('ls', null, {cwd: OTHER_TEST_DIR})
				.on('line/out', (line) => {
					bufferedLines.push(line);
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
			const cwd = createCwd('../not/exist');

			cwd.spawn('ls').on('error', (err) => {
				expect(err).to.be.an.instanceof(Error);
				expect(err.code).to.equal('ENOENT');
				done();
			});
		});
	});
};
