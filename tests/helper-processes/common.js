module.exports = {
	getString (size) {
		let str = '';

		for (let i = 0; i < size; i++) {
			str += 'a';
		}

		return str;
	},

	forLoop (num, callback) {
		for (let i = 0; i < num; i++) {
			callback(i);
		}
	}
};
