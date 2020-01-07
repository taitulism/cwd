const {expect} = require('chai');

const createCwd = require('..');
const Cwd = require('../src/Cwd');

module.exports = () => {
	it('is a function', () => {
		expect(createCwd).to.be.a('function');
	});

	describe('Single Default Instance', () => {
		it('has instance methods', () => {
			expect(createCwd.spawn).to.be.a('function');
			expect(createCwd.spawnShell).to.be.a('function');
			expect(createCwd.runCmd).to.be.a('function');
			expect(createCwd.runShellCmd).to.be.a('function');
		});

		it('Example use of .runCmd()', async () => {
			const {isOk} = await createCwd.runCmd('ls');

			expect(isOk).to.be.true;
		});

		it('Example use of .spawn()', (done) => {
			const childProc = createCwd.spawn('ls');
			let itWorks = false;

			childProc.on('line/out', (line) => {
				itWorks = true;
				expect(line).to.be.a('string');
			});

			childProc.on('close', () => {
				expect(itWorks).to.be.true;
				done();
			});
		});
	});

	describe('Default Parent Instance', () => {
		it('returns a Cwd Instance with stdio option', () => {
			expect(createCwd.stdio).to.be.null;
			expect(createCwd.parentProcess instanceof Cwd).to.be.true;
			expect(createCwd.parentProcess.stdio).to.equal('inherit');
		});

		it('has instance methods', () => {
			expect(createCwd.parentProcess.spawn).to.be.a('function');
			expect(createCwd.parentProcess.spawnShell).to.be.a('function');
			expect(createCwd.parentProcess.runCmd).to.be.a('function');
			expect(createCwd.parentProcess.runShellCmd).to.be.a('function');
		});

		it('redirects input & output to the parent process', async () => {
			const {isOk} = await createCwd.parentProcess.runCmd('echo 1/5 OK');

			expect(isOk).to.be.true;
		});
	});
};
