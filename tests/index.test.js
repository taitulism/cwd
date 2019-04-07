const { expect } = require('chai');
const sinon = require('sinon');
const createCwd = require('../');

const CwdClass = require('../src/Cwd');

const TEST_DIR = __dirname;

describe('\r=======\n- CWD -\n=======', () => {
    describe('Exports', () => {
        it('a creation function', () => {
            expect(typeof createCwd === 'function').to.be.true;
        });

        describe('Creation', () => {
            describe('When called with a /path/to/directory', () => {
                it('it returns a `Cwd` instance', () => {
                    const cwdInstance = createCwd(TEST_DIR);
    
                    expect(cwdInstance instanceof CwdClass).to.be.true;
                });
            });

            describe('When called with no params', () => {
                it('it throws an error', () => {
                    const shouldThrow = () => createCwd();
    
                    expect(shouldThrow).to.throw('Expecting one argument <String>, a directory path');
                });
            });

            describe('When called with /path/not/exists', () => {
                it('it throws an error', () => {
                    const shouldThrow = () => createCwd('/path/not/exists');
    
                    expect(shouldThrow).to.throw('No Such Directory');
                });
            });

            describe('When called with any other argument', () => {
                it('it throws an error', () => {
                    const shouldThrow1 = () => createCwd(10);
                    const shouldThrow2 = () => createCwd('');
                    const shouldThrow3 = () => createCwd(' ');
    
                    expect(shouldThrow1).to.throw('Expecting one argument <String>, a directory path');
                    expect(shouldThrow2).to.throw('Expecting one argument <String>, a directory path');
                    expect(shouldThrow3).to.throw('Expecting one argument <String>, a directory path');
                });
            });
        });
    });

    
    describe('Instance', () => {
        describe('API', () => {
            const cwdInstance = createCwd(TEST_DIR);

            describe('.runCmd()', () => {
                it('', () => {
                    expect(typeof cwdInstance.runCmd === 'function').to.be.true;
                });
            });

            describe('.runShellCmd()', () => {
                it('', () => {
                    expect(typeof cwdInstance.runShellCmd === 'function').to.be.true;
                });
            });

            describe('.spawnProcess()', () => {
                it('', () => {
                    expect(typeof cwdInstance.spawnProcess === 'function').to.be.true;
                });
            });

            describe('.spawnShell()', () => {
                it('', () => {
                    expect(typeof cwdInstance.spawnShell === 'function').to.be.true;
                });
            });

            describe('.resolveArguments()', () => {
                it('', () => {
                    expect(typeof cwdInstance.resolveArguments === 'function').to.be.true;
                });
            });
        });


        describe('Usage', () => {
            describe('.runCmd()', () => {
                let cwdInstance;
                beforeEach(() => { cwdInstance = createCwd(TEST_DIR) })
                afterEach(() => { cwdInstance = null })

                describe('when command is legit (e.g. `$ ls`)', () => {
                    it('returns an array with length 3', async () => {
                        const returnValue = await cwdInstance.runCmd('ls');
    
                        expect(Array.isArray(returnValue)).to.be.true;
                        expect(returnValue.length).to.equal(3);
                    });
                    
                    describe('Returned Array', () => {
                        describe('[0] err', () => {
                            it('is null when exit code is 0 (ok)', async () => {
                                const [returnValue, b, c] = await cwdInstance.runCmd('ls');
                                
                                expect(returnValue).to.be.null;
                            });
    
                            it('is an Error when exit code is NOT 0', async () => {
                                const [returnValue, b, c] = await cwdInstance.runCmd('ls', ['./bla']);
                                
                                expect(returnValue instanceof Error).to.be.true;
                                expect(returnValue.message.includes('Command failed: ls ./bla')).to.be.true;
                            });
                        });
                        
                        describe('[1] process.stdout', () => {
                            it('is a string', async () => {
                                const [a, returnValue, ...c] = await cwdInstance.runCmd('ls');
                                
                                expect(typeof returnValue === 'string').to.be.true;
                            });
    
                            it('is the command output', async () => {
                                const [a, returnValue, ...c] = await cwdInstance.runCmd('ls');
                                
                                expect(returnValue.trim()).to.equal('index.test.js');
                            });
                        });
                        
                        describe('[2] process.stderr', () => {
                            it('is a string', async () => {
                                const [a, b, returnValue] = await cwdInstance.runCmd('ls');
                                
                                expect(typeof returnValue === 'string').to.be.true;
                            });
                            
                            it('is the command errors', async () => {
                                const [a, b, returnValue] = await cwdInstance.runCmd('ls', ['./bla']);

                                expect(returnValue.includes('cannot access \'./bla\'')).to.be.true;
                            });
                        });
                    });
                });

                describe('when command not found (e.g. `$ bla`)', () => {
                    it('throws an error', async () => {
                        try {
                            await cwdInstance.runCmd('bla')
                            console.log('NEVER SEEN');
                            expect(false).to.be.true;
                        } catch (ex) {
                            expect(ex instanceof Error).to.be.true;
                        }
                    });
                });
            });

            describe('.runShellCmd()', () => {
                const cwdInstance = createCwd(TEST_DIR);

                it('calls .runCmd() with shell', async () => {
                    cwdInstance.runCmd = sinon.spy();

                    expect(cwdInstance.runCmd.notCalled).to.be.true;
                    await cwdInstance.runShellCmd('ls', ['./', '-la']);
                    expect(cwdInstance.runCmd.called).to.be.true;
                    expect(cwdInstance.runCmd.callCount).to.equal(1);

                    expect(cwdInstance.runCmd.getCall(0).args[0]).to.equal('ls');
                    expect(cwdInstance.runCmd.getCall(0).args[1]).to.deep.equal(['./', '-la']);
                    expect(cwdInstance.runCmd.getCall(0).args[2]).to.deep.equal({cwd: TEST_DIR, shell: true});
                    expect(cwdInstance.runCmd.getCall(0).args[3]).to.equal(null);

                    delete cwdInstance.runCmd;
                });
            });

            describe('.spawnProcess()', () => {
                let cwdInstance;
                beforeEach(() => { cwdInstance = createCwd(TEST_DIR) })
                afterEach(() => { cwdInstance = null })

                describe('when command is legit (e.g. `$ ls`)', () => {
                    it('returns a native child_process', async () => {
                        const returnValue = await cwdInstance.spawnProcess('ls');
    
                        expect(typeof returnValue === 'object').to.be.true;
                        expect(Object.getPrototypeOf(returnValue).constructor.name).to.equal('ChildProcess');
                    });

                    describe('Event: stdOut', () => {
                        it('emitted on regular stdout', (done) => {
                            const p = cwdInstance.spawnProcess('ls');

                            let stdoutDataCount = 0;
                            let stdOutCount = 0;
                            
                            p.stdout.on('data', () => {
                                stdoutDataCount++;
                            });
                            
                            p.on('stdOut', () => {
                                stdOutCount++
                            });

                            p.on('close', () => {
                                expect(stdOutCount).to.equal(stdoutDataCount);
                                done();
                            })
                        });

                        it('event data is an array of string (lines)', (done) => {
                            const p = cwdInstance.spawnProcess('ls');

                            let lines;

                            p.on('stdOut', (linesAry) => {
                                lines = linesAry;
                            });
                            
                            p.on('close', () => {
                                expect(Array.isArray(lines)).to.be.true;
                                expect(typeof lines[0]).to.equal('string');
                                done();
                            })
                        });
                    });
                    
                    describe('Event: stdErr', () => {
                        it('emitted on regular stdout', (done) => {
                            const p = cwdInstance.spawnProcess('ls ./bla');

                            let stderrDataCount = 0;
                            let stdErrCount = 0;

                            p.stderr.on('data', () => {
                                stderrDataCount++;
                            });
                            
                            p.on('stdErr', () => {
                                stdErrCount++
                            });

                            p.on('close', () => {
                                expect(stdErrCount).to.equal(stderrDataCount);
                                done();
                            });
                        });

                        it('event data is an array of string (lines)', (done) => {
                            const p = cwdInstance.spawnProcess('ls ./bla');

                            let lines;

                            p.on('stdErr', (linesAry) => {
                                lines = linesAry;
                            });
                            
                            p.on('close', () => {
                                expect(Array.isArray(lines)).to.be.true;
                                expect(typeof lines[0]).to.equal('string');
                                done();
                            })
                        });
                    });
                });
            });
        });
    });
});
