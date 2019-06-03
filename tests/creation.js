const {expect} = require('chai');

const {TEST_DIR} = require('./constants');
const Cwd = require('../');

const creationErrMsg = 'Cwd expects one argument <String>, a path to a directory.';

module.exports = () => {
	describe('When called with a path-to-directory', () => {
		it('it returns a Cwd instance', () => {
			const cwdInstance = new Cwd(TEST_DIR);

			expect(cwdInstance instanceof Cwd).to.be.true;
		});
	});

	describe('Creation Errors', () => {
		it('throws when called with no params', () => {
			expect(() => new Cwd()).to.throw(creationErrMsg);
		});

		it('throws when called with an empty string', () => {
			expect(() => new Cwd('')).to.throw(creationErrMsg);
		});

		it('throws when called with a non string', () => {
			expect(() => new Cwd(10)).to.throw(creationErrMsg);
		});
	});
};
