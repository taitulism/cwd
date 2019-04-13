let count = 10;

process.stdout.write('a-process FIRST line\n')


const ref = setInterval(() => {
    // if (count === 3 || count === 7) {
    //     console.log(count);
        // process.stderr.write(`${count}\n`);
    // }
    // else {
        console.log('  Count: ', count, '>> ');
    // }

    count--;

    if (count <= 0) {
        clearInterval(ref);
        // process.stderr.write('errrrr'); process.exit(1);
        // throw new Error('333!!!')

        process.stdout.write('a-process LAST line\n'); process.exit(0);
    }

}, 200);


