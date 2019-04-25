module.exports = {
	getString (size) {
		let str = '';

		for (let i = 0; i < size; i++) {
			str += 'a';
		}

		return str;
	},
};
