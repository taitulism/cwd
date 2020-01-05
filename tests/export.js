const {expect} = require('chai');

const createCwd = require('..');

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
		it('has instance methods', () => {
			expect(createCwd.parent.spawn).to.be.a('function');
			expect(createCwd.parent.spawnShell).to.be.a('function');
			expect(createCwd.parent.runCmd).to.be.a('function');
			expect(createCwd.parent.runShellCmd).to.be.a('function');
		});

		it('redirects input & output to the parent process', async () => {
			const {isOk} = await createCwd.parent.runCmd('ls');

			expect(isOk).to.be.true;
		});
	});
};
