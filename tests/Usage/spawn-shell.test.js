const {expect} = require('chai');
const sinon = require('sinon');

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
		it('spawns with a shell', (done) => {
			const spy = sinon.spy(Object.getPrototypeOf(cwd), '_spawn');

			cwd.spawnShell('ls').on('close', () => {
				expect(spy.callCount).to.equal(1);
				expect(spy.firstCall.args).to.have.lengthOf(3);
				expect(spy.firstCall.args[2]).to.be.an('object');
				expect(spy.firstCall.args[2].shell).to.be.true;
				spy.restore();
				done();
			});
		});
	});
};
