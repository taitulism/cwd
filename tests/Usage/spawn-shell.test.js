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
		it('spawns with a shell', (done) => {
			const spy = sinon.spy(Object.getPrototypeOf(cwd), 'spawn');

			cwd.spawnShell('ls').on('close', () => {
				expect(spy.callCount).to.equal(1);
				expect(spy.firstCall.args).to.have.lengthOf(4);
				expect(spy.firstCall.args[2]).to.be.an('object');
				expect(spy.firstCall.args[2].shell).to.be.true;
				expect(spy.firstCall.args[3]).to.be.true;
				spy.restore();
				done();
			});
		});

		it('handles shell characters', (done) => {
			// echo with no spaces for windows cmd :/
			const childProc = cwd.spawnShell('echo A&& echo B&& echo C');
			const lineOutArray = [];
			const expectedArray = ['A', 'B', 'C'];

			childProc.on('line/out', (line) => {
				lineOutArray.push(line);
			});

			childProc.on('close', () => {
				expect(lineOutArray).to.eql(expectedArray);
				done();
			});
		});
	});
};
