const {expect} = require('chai');

const {TEST_DIR} = require('./constants');
const Cwd = require('../');

module.exports = () => {
	describe('When called with a path-to-directory', () => {
		it('it returns an instance', () => {
			const cwdInstance = new Cwd(TEST_DIR);

			expect(cwdInstance instanceof Cwd).to.be.true;
		});
	});

	describe('When called with no params', () => {
		it('it throws an error', () => {
			const shouldThrow = () => new Cwd();
			const errMsg = 'Expecting one argument <String>, a directory path';

			expect(shouldThrow).to.throw(errMsg);
		});
	});

	describe('When called with a non-exist-path', () => {
		it('it throws an error', () => {
			const shouldThrow = () => new Cwd('/path/not/exists');

			expect(shouldThrow).to.throw('No Such Directory');
		});
	});

	describe('When called with any other argument (but string)', () => {
		it('it throws an error', () => {
			const shouldThrow1 = () => new Cwd(10);
			const shouldThrow2 = () => new Cwd('');
			const shouldThrow3 = () => new Cwd(' ');

			const errMsg = 'Expecting one argument <String>, a directory path';

			expect(shouldThrow1).to.throw(errMsg);
			expect(shouldThrow2).to.throw(errMsg);
			expect(shouldThrow3).to.throw(errMsg);
		});
	});
};
