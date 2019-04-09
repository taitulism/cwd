const { expect } = require('chai');

const { TEST_DIR } = require('../constants');
const createCwd = require('../..');

module.exports = () => {
	let cwdInstance;
	beforeEach(() => { cwdInstance = createCwd(TEST_DIR) })
	afterEach(() => { cwdInstance = null })

	describe('When command is legit (e.g. `ls`)', () => {
		it('returns an array', async () => {
			const returnValue = await cwdInstance.runCmd('ls');

			expect(returnValue).to.be.an('array');
		});

		describe('Returned Array', () => {
			describe('[0] isOk', () => {
				it('is true when exit code is 0', async () => {
					const [returnValue, b, c] = await cwdInstance.runCmd('ls');

					expect(returnValue).to.be.true;
				});

				it('is false when exit code is NOT 0', async () => {
					const [returnValue, b, c] = await cwdInstance.runCmd('ls', ['./bla']);

					expect(returnValue).to.be.false;
				});
			});

			describe('[1] process.stdout', () => {
				it('is a string', async () => {
					const [a, returnValue, ...c] = await cwdInstance.runCmd('ls');

					expect(returnValue).to.be.a('string');
				});

				it('is the command output', async () => {
					const [a, returnValue, ...c] = await cwdInstance.runCmd('ls');

					expect(returnValue.includes('Cwd.js')).to.be.true;
				});
			});

			describe('[2] process.stderr', () => {
				it('is a string', async () => {
					const [a, b, returnValue] = await cwdInstance.runCmd('ls');

					expect(returnValue).to.be.a('string');
				});

				it('is the command errors', async () => {
					const [a, b, returnValue] = await cwdInstance.runCmd('ls', ['./bla']);

					expect(returnValue).to.have.string('No such file or directory');
				});
			});
		});
	});

	describe('When called without arguments', () => {
		it('rejects with an error', () => {
			const shouldReject = () => {
				return cwdInstance.runCmd();
			};

			expect(shouldReject()).to.be.rejectedWith('First argument (cmd) must be a string');
		});
	});

	describe('When called with a command that doesn\'t exist (e.g. `bla`)', () => {
		it('rejects with an error', () => {
			const shouldReject = () => {
				return cwdInstance.runCmd('bla');
			}

			expect(shouldReject()).to.be.rejectedWith('bla ENOENT');
		});
	});
};
