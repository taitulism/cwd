const {EOL} = require('os');

process.stdout.write(`out 1${EOL}`);
process.stderr.write(`err 1${EOL}`);
process.stdout.write(`out 2${EOL}`);
process.stderr.write(`err 2${EOL}`);
