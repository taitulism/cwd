const {expect} = require('chai');

const {TEST_DIR} = require('../constants');
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
		it('returns an array', async () => {
			const returnValue = await cwd.runCmd('ls');

			expect(returnValue).to.be.an('array');
		});

		describe('Returned Array', () => {
			describe('[0] isOk', () => {
				it('is true when exit code is 0', async () => {
					const [returnValue] = await cwd.runCmd('ls');

					expect(returnValue).to.be.true;
				});

				it('is false when exit code is NOT 0', async () => {
					const [returnValue] = await cwd.runCmd('ls', ['./bla']);

					expect(returnValue).to.be.false;
				});
			});

			describe('[1] process.stderr', () => {
				it('is a string', async () => {
					const [, returnValue] = await cwd.runCmd('ls', ['./bla']);

					expect(returnValue).to.be.a('string');
				});

				it('is the command errors', async () => {
					const [, returnValue] = await cwd.runCmd('ls', ['./bla']);

					expect(returnValue).to.have.string('No such file or directory');
				});
			});

			describe('[2] process.stdout', () => {
				it('is a string', async () => {
					const [,, returnValue] = await cwd.runCmd('ls');

					expect(returnValue).to.be.a('string');
				});

				it('is the command output', async () => {
					const [,, returnValue] = await cwd.runCmd('ls');

					expect(returnValue).to.include('aaa')
						.and.include('bbb')
						.and.include('ccc')
				});
			});

			describe('Other Props', () => {
				describe('.exitCode', () => {
					it('is a number', async () => {
						const {exitCode} = await cwd.runCmd('ls');

						expect(exitCode).to.be.a('number');
					});

					it('equal 0 when everything is ok', async () => {
						const {exitCode} = await cwd.runCmd('ls');

						expect(exitCode).to.equal(0);
					});
				});

				describe('.stderr', () => {
					it('is a string', async () => {
						const {stderr} = await cwd.runCmd('ls');

						expect(stderr).to.be.a('string');
					});

					it('is the command errors', async () => {
						const {stderr} = await cwd.runCmd('ls', ['./bla']);

						expect(stderr).to.have.string('No such file or directory');
					});
				});

				describe('.stdout', () => {
					it('is a string', async () => {
						const {stdout} = await cwd.runCmd('ls');

						expect(stdout).to.be.a('string');
					});

					it('is the command output', async () => {
						const {stdout} = await cwd.runCmd('ls');

						expect(stdout).to.include('aaa')
							.and.include('bbb')
							.and.include('ccc')
					});
				});
			});
		});
	});

	describe('Max buffer (default: ~5MB)', () => {
		let cwd;

		beforeEach(() => {
			cwd = new Cwd('./tests/helper-processes');
		});

		afterEach(() => {
			cwd = null;
		});

		const FIVE_MEGABYTES = 1024 * 1024 * 5;

		it('doesn\'t throw when NOT exceeded', async () => {
			try {
				const file = 'max-buffer-out.js';
				const [,, out] = await cwd.runCmd(`node ${file}`, [FIVE_MEGABYTES]);

				expect(out).to.be.ok;
			}
			catch (ex) {
				expect(true).to.be.false;
			}

			try {
				const file = 'max-buffer-err.js';
				const [, err] = await cwd.runCmd(`node ${file}`, [FIVE_MEGABYTES]);

				expect(err).to.be.ok;
			}
			catch (ex) {
				expect(true).to.be.false;
			}
		}).slow(4500).timeout(10000);

		it('throws when exceeded', async () => {
			try {
				const file = 'max-buffer-out.js';

				await cwd.runCmd(`node ${file}`, [FIVE_MEGABYTES + 1]);

				expect(false).to.be.true;
			}
			catch (ex) {
				expect(ex.message).to.have.string('buffer size exceeded');
			}

			try {
				const file = 'max-buffer-err.js';

				await cwd.runCmd(`node ${file}`, [FIVE_MEGABYTES + 1]);

				expect(false).to.be.true;
			}
			catch (ex) {
				expect(ex.message).to.have.string('buffer size exceeded');
			}
		}).slow(4500).timeout(10000);
	});

	describe('When called without arguments', () => {
		it('rejects with an error', () => {
			const rejectionMsg = 'First argument (cmd) must be a string';
			const shouldReject = () => cwd.runCmd();

			expect(shouldReject()).to.be.rejectedWith(rejectionMsg);
		});
	});

	describe('When called with a command that doesn\'t exist (e.g. `bla`)', () => {
		it('rejects with an error', () => {
			const shouldReject = () => cwd.runCmd('bla');

			expect(shouldReject()).to.be.rejectedWith('bla ENOENT');
		});
	});
};
