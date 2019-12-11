const {expect} = require('chai');
const os = require('os');

const {TEST_DIR} = require('./constants');
const createCwd = require('../');
const Cwd = require('../src/Cwd');

const creationErrMsg = 'Cwd expects one argument <String>, a path to a directory.';

module.exports = () => {
	describe('When called', () => {
		it('returns a Cwd instance', () => {
			const cwdInstance = createCwd();

			expect(cwdInstance instanceof Cwd).to.be.true;
		});
	});

	describe('When called with a path-to-directory', () => {
		it('returns a Cwd instance with the given path under ".dirPath"', () => {
			const cwdInstance = createCwd(TEST_DIR);

			expect(cwdInstance.dirPath).to.equal(TEST_DIR);
		});
	});

	describe('When called with no params', () => {
		it('defaults to the current process.cwd', async () => {
			const cwdInstance = createCwd();

			const getCwdByPlatform = os.platform() === 'win32'
				? 'echo %cd%'
				: 'echo $PWD';

			const {stdout} = await cwdInstance.runShellCmd(getCwdByPlatform);
			expect(stdout).to.equal(process.cwd());
		});
	});

	describe('Creation Errors', () => {
		it('throws when called with a non string', () => {
			expect(() => createCwd(10)).to.throw(creationErrMsg);
		});
	});
};
