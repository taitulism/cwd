const {expect} = require('chai');

const {TEST_DIR} = require('../constants');
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
		it('returns a promise', () => {
			const promise = cwd.runCmd('ls');

			expect(promise).to.be.instanceOf(Promise);
		});

		it('that resolves with an object', () => (
			expect(cwd.runCmd('ls')).to.eventually.be.an('object')
		));

		describe('Returned Object Props', () => {
			describe('.exitCode', () => {
				it('Number', async () => {
					const {exitCode} = await cwd.runCmd('ls');

					expect(exitCode).to.be.a('number');
				});

				it('equal 0 when everything is ok', async () => {
					const {exitCode} = await cwd.runCmd('ls');

					expect(exitCode).to.equal(0);
				});

				it('is not 0 when something went wrong', async () => {
					const {exitCode} = await cwd.runCmd('ls', ['./bla']);

					expect(exitCode).to.not.equal(0);
				});
			});

			describe('.isOk', () => {
				it('is true when exit code is 0', async () => {
					const {isOk} = await cwd.runCmd('ls');

					expect(isOk).to.be.true;
				});

				it('is false when exit code is NOT 0', async () => {
					const {isOk} = await cwd.runCmd('ls', ['./bla']);

					expect(isOk).to.be.false;
				});
			});

			describe('.stderr', () => {
				it('String', async () => {
					const {stderr} = await cwd.runCmd('ls');

					expect(stderr).to.be.a('string');
				});

				it('is the command stderr', async () => {
					const {stderr} = await cwd.runCmd('ls', ['./bla']);

					expect(stderr).to.have.string('No such file or directory');
				});
			});

			describe('.stdout', () => {
				it('String', async () => {
					const {stdout} = await cwd.runCmd('ls');

					expect(stdout).to.be.a('string');
				});

				it('is the command stdout', async () => {
					const {stdout} = await cwd.runCmd('ls');

					expect(stdout).to.include('aaa')
						.and.include('bbb')
						.and.include('ccc');
				});
			});

			describe('.output', () => {
				it('String', async () => {
					const file = '../helper-processes/out-and-err.js';
					const {output} = await cwd.runCmd(`node ${file}`);

					expect(output).to.be.a('string');
				});

				it('is the command output (both stdout & stderr)', async () => {
					const file = '../helper-processes/out-and-err.js';
					const {output} = await cwd.runCmd(`node ${file}`);

					expect(output).to.include('out 1')
						.and.include('out 2')
						.and.include('err 1')
						.and.include('err 2');
				});
			});

			describe('.stderrLines', () => {
				it('Array', async () => {
					const {stderrLines} = await cwd.runCmd('ls', ['./bla']);

					expect(stderrLines).to.be.an('array');
				});

				it('is the command stderr split into lines', async () => {
					const {stderrLines} = await cwd.runCmd('ls', ['./bla']);

					expect(stderrLines[0]).to.have.string('No such file or directory');
				});
			});

			describe('.stdoutLines', () => {
				it('Array', async () => {
					const {stdoutLines} = await cwd.runCmd('ls');

					expect(stdoutLines).to.be.an('array');
				});

				it('is the command stdout split into lines', async () => {
					const {stdoutLines} = await cwd.runCmd('ls');

					expect(stdoutLines).to.include('aaa')
						.and.include('bbb')
						.and.include('ccc');
				});
			});

			describe('.lines', () => {
				it('Array', async () => {
					const file = '../helper-processes/out-and-err.js';
					const {lines} = await cwd.runCmd(`node ${file}`);

					expect(lines).to.be.an('array');
				});

				it('is the command stdout split into lines', async () => {
					const file = '../helper-processes/out-and-err.js';
					const {lines} = await cwd.runCmd(`node ${file}`);

					expect(lines).to.include('out 1')
						.and.include('out 2')
						.and.include('err 1')
						.and.include('err 2');
				});
			});
		});
	});

	describe('options.maxCacheSize', () => {
		let cwd;

		beforeEach(() => {
			cwd = createCwd('./tests/helper-processes');
		});

		afterEach(() => {
			cwd = null;
		});

		const ONE_MEGABYTE = 1024 * 1024;
		const TEN_MEGABYTES = ONE_MEGABYTE * 10;

		describe('options.maxCache', () => {
			it('doesn\'t throw when not exceeded', async () => {
				try {
					const file = 'max-buffer-out.js';
					const {stdout} = await cwd.runCmd(`node ${file} ${ONE_MEGABYTE}`, {maxCacheSize: 1});

					expect(stdout).to.be.ok;
				}
				catch (ex) {
					expect(ex).to.be.null;
				}

			}).slow(1000).timeout(10000);

			it('throws when exceeded', async () => {
				try {
					const file = 'max-buffer-out.js';
					await cwd.runCmd(`node ${file} ${ONE_MEGABYTE + 1}`, {maxCacheSize: 1});

					expect(true).to.be.false;
				}
				catch (ex) {
					expect(ex.message).to.have.string('buffer size exceeded');
				}
			}).slow(1000).timeout(10000);

			it('counts both streams', async () => {
				try {
					const file = 'max-buffer-out-and-err.js';
					const {stdout, stderr} = await cwd.runCmd(`node ${file} ${ONE_MEGABYTE}`, {maxCacheSize: 1});

					expect(stdout).to.be.ok;
					expect(stderr).to.be.ok;
				}
				catch (ex) {
					expect(ex).to.be.null;
				}

				try {
					const file = 'max-buffer-out-and-err.js';
					await cwd.runCmd(`node ${file} ${ONE_MEGABYTE + 2}`, {maxCacheSize: 1});

					expect(true).to.be.false;
				}
				catch (ex) {
					expect(ex.message).to.have.string('buffer size exceeded');
				}

				console.log('PLEASE WAIT. The following test takes a few seconds...');
			}).slow(1000).timeout(10000);

			it('default value is 10MB', async () => {
				// Pass
				try {
					const file = 'max-buffer-out.js';
					const {stdout} = await cwd.runCmd(`node ${file} ${TEN_MEGABYTES}`);

					expect(stdout).to.be.ok;
				}
				catch (ex) {
					expect(ex).to.be.null;
				}

				// Fail
				try {
					const file = 'max-buffer-out.js';
					await cwd.runCmd(`node ${file} ${TEN_MEGABYTES + 1}`);
					expect(true).to.be.false;
				}
				catch (ex) {
					expect(ex.message).to.have.string('buffer size exceeded');
				}
			}).slow(12000).timeout(20000);
		});
	});

	describe('When called without arguments', () => {
		it('rejects with an error', () => {
			const shouldThrow = () => cwd.runCmd();

			expect(shouldThrow).to.throw(errors.CmdIsNotString);
		});
	});

	describe('When called with a command that doesn\'t exist (e.g. `bla`)', () => {
		it('rejects with an error', () => {
			const shouldReject = () => cwd.runCmd('bla');

			return expect(shouldReject()).to.be.rejectedWith('bla ENOENT');
		});
	});
};
