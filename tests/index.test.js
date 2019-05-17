const chai = require('chai');
const {expect} = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const {TEST_DIR} = require('./constants');
const Cwd = require('../');

describe('\r===========\n-  C W D  -\n===========', () => {
	describe('Creation', require('./creation'));

	describe('Instance', () => {
		describe('API / Reference', () => {
			const cwdInstance = new Cwd(TEST_DIR);

			it('.spawn(cmd, args, opts)', () => {
				expect(cwdInstance.spawn).to.be.a('function');
			});

			it('.spawnShell(cmd, args, opts)', () => {
				expect(cwdInstance.spawnShell).to.be.a('function');
			});

			it('.runCmd(cmd, args, opts)', () => {
				expect(cwdInstance.runCmd).to.be.a('function');
			});
		});

		describe('Usage', require('./Usage'));
	});
});
