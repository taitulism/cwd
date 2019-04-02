let count = 5;

const ref = setInterval(() => {
    console.log('Count: ', count);

    if (count <= 0) {
        clearInterval(ref);
    }

    if (count === 2) {
        // process.stderr.write('errrrr')
        process.exit(0)
        // throw new Error('333!!!')
    }

    count--;
}, 200);


