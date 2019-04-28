const {expect} = require('chai');
const sinon = require('sinon');

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
		it.only('spawns with a shell', (done) => {
			// console.log(Object.getPrototypeOf(cwdInstance));
			const stub = sinon.spy(Object.getPrototypeOf(cwdInstance), '_spawn');

			cwdInstance.spawnShell('ls').on('close', () => {

				console.log('callCount', stub.callCount);

				stub.restore();
				expect(stub.callCount).to.equal(1)
				done()
			});


			// expect(stub).to.h
		});
	});
};
