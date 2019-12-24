const {expect} = require('chai');
const sinon = require('sinon');

const {TEST_DIR} = require('../constants');
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
		it('spawns with a shell', async () => {
			const spy = sinon.spy(Object.getPrototypeOf(cwd), 'spawn');

			try {
				await cwd.runShellCmd('ls');
				expect(spy.callCount).to.equal(1);
				expect(spy.firstCall.args).to.have.lengthOf(4);
				expect(spy.firstCall.args[2]).to.be.an('object');
				expect(spy.firstCall.args[2].shell).to.be.true;
				expect(spy.firstCall.args[3]).to.be.true;
				spy.restore();
			}
			catch (ex) {
				expect(false).to.be.true;
			}
		});

		it('handles shell characters', async () => {
			const {stdoutLines} = await cwd.runShellCmd('echo A && echo B && echo C');
			const expectedArray = ['A', 'B', 'C'];

			expect(stdoutLines).to.eql(expectedArray);
		});
	});
};
