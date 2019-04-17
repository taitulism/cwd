const chai = require('chai');
const {expect} = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const {TEST_DIR} = require('./constants');
const createCwd = require('../');

describe('\r===========\n-  C W D  -\n===========', () => {
	describe('Creation', require('./creation'));

	describe('Instance', () => {
		describe('API / Reference', () => {
			const cwdInstance = createCwd(TEST_DIR);

			it('.spawnProcess(cmd, args, opts)', () => {
				expect(cwdInstance.spawnProcess).to.be.a('function');
			});

			it('.runCmd(cmd, args, opts)', () => {
				expect(cwdInstance.runCmd).to.be.a('function');
			});
		});

		describe('Usage', require('./Usage'));
	});
});
