

const createCwd = require('..');

const DIR = __dirname;

const cwd = createCwd(DIR);

(async () => {
    // const [returnValue, b, c] = await cwd.runCmd('ls', ['./bla']);
    // console.log(returnValue instanceof Error);

    try {
        console.log('trying...');
        await cwd.runCmd('bla')
    } catch (ex) {
        console.log(ex instanceof Error);
        console.log('A HA!');
    }
})()
