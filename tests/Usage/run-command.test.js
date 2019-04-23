const {expect} = require('chai');

const {TEST_DIR} = require('../constants');
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
		it('returns an array', async () => {
			const returnValue = await cwdInstance.runCmd('ls');

			expect(returnValue).to.be.an('array');
		});

		describe('Returned Array', () => {
			describe('[0] isOk', () => {
				it('is true when exit code is 0', async () => {
					const [returnValue] = await cwdInstance.runCmd('ls');

					expect(returnValue).to.be.true;
				});

				it('is false when exit code is NOT 0', async () => {
					const [returnValue] = await cwdInstance.runCmd('ls', ['./bla']);

					expect(returnValue).to.be.false;
				});
			});

			describe('[1] process.stdout', () => {
				it('is a string', async () => {
					const [, returnValue] = await cwdInstance.runCmd('ls');

					expect(returnValue).to.be.a('string');
				});

				it('is the command output', async () => {
					const [, returnValue] = await cwdInstance.runCmd('ls');

					expect(returnValue.includes('Cwd.js')).to.be.true;
				});
			});

			describe('[2] process.stderr', () => {
				it('is a string', async () => {
					const [, , returnValue] = await cwdInstance.runCmd('ls');

					expect(returnValue).to.be.a('string');
				});

				it('is the command errors', async () => {
					const [, , returnValue] = await cwdInstance.runCmd('ls', ['./bla']);

					expect(returnValue).to.have.string('No such file or directory');
				});
			});
		});
	});

	describe('Channels max buffer (default: ~5MB)', () => {
		let cwd;

		beforeEach(() => {
			cwd = createCwd('./tests/helper-processes');
		});

		afterEach(() => {
			cwd = null;
		});

		const maxStrSizeAllowed = 4766250;

		it('throws when exceeded', async () => {
			try {
				const file = 'max-buffer-out.js';

				await cwd.runCmd(`node ${file}`, [maxStrSizeAllowed + 1]);

				expect(false).to.be.true;
			}
			catch (ex) {
				expect(ex.message).to.have.string('buffer size exceeded');
			}

			try {
				const file = 'max-buffer-err.js';

				await cwd.runCmd(`node ${file}`, [maxStrSizeAllowed + 1]);

				expect(false).to.be.true;
			}
			catch (ex) {
				expect(ex.message).to.have.string('buffer size exceeded');
			}
		}).timeout(5000);

		it('doesn\'t throw when NOT exceeded', async () => {
			try {
				const file = 'max-buffer-out.js';
				const [, out] = await cwd.runCmd(`node ${file}`, [maxStrSizeAllowed]);

				expect(out).to.be.ok;
			}
			catch (ex) {
				expect(true).to.be.false;
			}

			try {
				const file = 'max-buffer-err.js';
				const [,, err] = await cwd.runCmd(`node ${file}`, [maxStrSizeAllowed]);

				expect(err).to.be.ok;
			}
			catch (ex) {
				expect(true).to.be.false;
			}
		}).timeout(5000);
	});

	describe('When called without arguments', () => {
		it('rejects with an error', () => {
			const rejectionMsg = 'First argument (cmd) must be a string';
			const shouldReject = () => cwdInstance.runCmd();

			expect(shouldReject()).to.be.rejectedWith(rejectionMsg);
		});
	});

	describe('When called with a command that doesn\'t exist (e.g. `bla`)', () => {
		it('rejects with an error', () => {
			const shouldReject = () => cwdInstance.runCmd('bla');

			expect(shouldReject()).to.be.rejectedWith('bla ENOENT');
		});
	});
};
