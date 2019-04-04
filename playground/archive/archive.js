
.on('error', err => {
    console.log('childProc throwing...');
    reject([
        `Cwd.execFile\nCommand: ${cmd}\nArguments: ${args}\nDirectory:${this.dirPath}`,
        err
    ]);
})





try {

}
catch (err) {
    console.log('cought!');
    reject([
        `Cwd.execFile\nCommand: ${cmd}\nArguments: ${args}\nDirectory:${this.dirPath}`,
        err
    ]);
}