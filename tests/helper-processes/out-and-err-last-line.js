/* eslint-disable no-negated-condition */

const {EOL} = require('os');

/* eslint-disable-next-line prefer-destructuring */
const channel = process.argv[2];

/*
Attention: Every two EOLs output a single empty line.
	aaa
	bbb
	|
	ccc
	|
	|
	ddd
*/
const str1 = `aaa${EOL}bbb${EOL}`;
const str2 = `${EOL}ccc${EOL}${EOL}${EOL}ddd`;

if (channel === 'stdout') {
	process.stdout.write(str1);
	process.stdout.write(str2);
}
else if (channel === 'stderr') {
	process.stderr.write(str1);
	process.stderr.write(str2);
}
else if (!channel) { // both
	process.stdout.write(str1);
	process.stderr.write(str2);
}
else {
	let errorMsg = `out-and-err-last-line.js script invalid argument "${channel}".`;
	errorMsg += ' Expected values: "stdout", "stderr" or "" (empty line)';

	throw new Error(errorMsg);
}
