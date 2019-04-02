let count = 10;

const ref = setInterval(() => {
    console.log('Count: ', count);

    if (count <= 0) {
        clearInterval(ref);
    }

    if (count === 3) {
        process.stderr.write('errrrr')
        process.exit(1)
        // throw new Error('333!!!')
    }

    count--;
}, 200);


