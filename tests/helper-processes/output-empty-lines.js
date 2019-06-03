const {EOL} = require('os');

const str1 = `aaa${EOL}bbb${EOL}`;
const str2 = `${EOL}ccc${EOL}${EOL}${EOL}ddd${EOL}`;

// Every two EOLs in a row output a single empty line.

process.stdout.write(str1);
process.stdout.write(str2);
