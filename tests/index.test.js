const chai = require('chai');
const {expect} = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const {TEST_DIR} = require('./constants');
const createCwd = require('../');
const Cwd = require('../src/Cwd');

describe('\r===========\n-  C W D  -\n===========', () => {
	describe('Exports', require('./export'));
	describe('Creation', require('./creation'));

	describe('Instance', () => {
		describe('API / Reference', () => {
			const cwdInstance = createCwd(TEST_DIR);

			it('.spawn(cmd, args, opts)', () => {
				expect(cwdInstance.spawn).to.be.a('function');
			});

			it('.spawnShell(cmd, args, opts)', () => {
				expect(cwdInstance.spawnShell).to.be.a('function');
			});

			it('.runCmd(cmd, args, opts)', () => {
				expect(cwdInstance.runCmd).to.be.a('function');
			});

			it('.runShellCmd(cmd, args, opts)', () => {
				expect(cwdInstance.runShellCmd).to.be.a('function');
			});

			describe('[getter] .parent', () => {
				it('returns a Cwd Instance with stdio option', () => {
					expect(cwdInstance.stdio).to.be.null;
					expect(cwdInstance.parentProcess instanceof Cwd).to.be.true;
					expect(cwdInstance.parentProcess.stdio).to.equal('inherit');
				});

				describe('When piping to parent process', () => {
					it('pipes everything to screen', () => {
						cwdInstance.parentProcess.spawn('echo 2/5 OK');
					});
				});

				describe('When piping to parent process', () => {
					it('pipes everything to screen', () => {
						cwdInstance.parentProcess.spawnShell('echo 3/5 OK');
					});
				});

				describe('When piping to parent process', () => {
					it('pipes everything to screen', () => {
						cwdInstance.parentProcess.runCmd('echo 4/5 OK');
					});
				});

				describe('When piping to parent process', () => {
					it('pipes everything to screen', () => {
						cwdInstance.parentProcess.runShellCmd('echo 5/5 OK');
					});
				});
			});
		});

		describe('Usage', require('./Usage'));
	});
});
