run-in-cwd
==========
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/cwd.svg?branch=master)](https://travis-ci.org/taitulism/cwd)

A wrapper around Node's `child_process.spawn()`.

## Get Started
1. Install 
    ```sh
    $ npm install run-in-cwd
    ```
2. Require
    ```js
    const Cwd = require('run-in-cwd')
    ```
3. Create `Cwd` Instance
    ```js
    const projectDir = new Cwd('./path/to/project/folder')
    ```
&nbsp; &nbsp; &nbsp; ***NOTE:** Cwd constructor checks path existance synchronously and throws an error if path not found.*

&nbsp;




## Instance API

>**WARNING:** If you let your users pass in the command and/or any of its arguments - make sure they are safe and don't forget to handle errors.

------------------------------------------------------------
### **.runCmd(** cmd, [args, [options] ] **)**
------------------------------------------------------------
Executes a command and returns a promise when the command exits.  
Similar to Node's `child_process.exec` and `child_process.execFile` ([see docs](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)). 

Take care of errors with `promise.catch()` or a `try-catch` wrapper.

**Arguments:**
* **cmd** *(Required)* - A command string (e.g. `'npm'`)
* **args** - An array of the command's arguments (e.g. `['-flag', 'cache=500']`)
* **options** - spawn options object. [See Node's docs](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

**Returns:** A promise for the command results.

The result is an array with 3 items:
1. **`isOk`** - Boolean - `true` if command exit code is 0. `false` otherwise.
2. **`stdout`** - String - The process `stdout` string (utf-8 encoded)
3. **`stderr`** - String - The process `stderr` string (utf-8 encoded)

>Both `stdout` & `stderr` strings are buffered and has a max limit of ~ 5MB.  
`runCmd()` will throw an exception when max size is exceeded.

**Examples:**  
First, create instance:
```js
const Cwd = require('run-in-cwd');
const projectDir = new Cwd('./path/to/project');
```

Promise Style:
```js
projectDir.runCmd('git status')
    .then([isOk, stdout, stderr] => {
        // ...
    })
    .catch((err) => {
        // handle exception...
    });
```

Async-Await Style:
```js
(async () => { // `await` only runs inside async functions
    try {
        const [isOk, stdout, stderr] = await projectDir.runCmd('git status')

        // ...
    }
    catch (ex) {
        // handle exception...
    }
})();
```

Sometime we don't need all of the arguments. You can use ES6 syntax:
```js
const [ isOk ] = await projectDir.runCmd()
// or
const [,, stderr] = await projectDir.runCmd()
```

### The difference between `exception` and `stderr`:
`exception` is an `Error` instance thrown when the execution of a command had a problem:  
the command itself is not found, max buffer size exceeded, machine is on fire etc.

A running process has two output channels: one for regular output (`childProc.stdout`), and one for errors (`childProc.stderr`). The result `stderr` is a string which is buffered from the command's `stderr` output channel.

&nbsp;




------------------------------------------------------------
### **.spawn(** cmd, [args, [options] ] **)**
------------------------------------------------------------
Runs a command and returns a child process with some extra events.

> It is highly recommended to listen to the `'error'` event.
```js
childProc.on('error', (err) => { /* handle error */ })
```

**Arguments:**
* **cmd** *(Required)* - A command string (e.g. `'npm'`)
* **args** - An array of the command's arguments (e.g. `['-flag', 'cache=500']`)
* **options** - spawn options object. [See Node's docs](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

**Returns:** \<child_process\>

**Examples:**  
Calling `.spawn()` is only the first part of spawning a process. We then need to handle the returned process's lifecycle events.

First, spawn a child process:
```js
const Cwd = require('run-in-cwd');
const cwd = new Cwd('./path/to/dir');

// Simple command
const childProc = cwd.spawn('ls')

// With arguments
const childProc = cwd.spawn('git', ['status'])

// you can also do:
const childProc = cwd.spawn('git status')

// and also:
const childProc = cwd.spawnShell('git add -A && git commit')
```

------------------------------------------------------------
### **.spawnShell(** cmd, [args, [options] ] **)**
------------------------------------------------------------
Is the same as `.spawn()` but with the `{shell: true}` option.

&nbsp;

**\<child_process\>**
---------------------
`.spawn`'s return object is [Node's native ChildProcess](https://nodejs.org/api/child_process.html#child_process_class_childprocess) with some extra events.

* ### Event: `'stdOut'`  
    Is triggered when `child_process.stdout.on('data')` is triggered (excluding empty lines).
    The event data is the `stdout` split into an array of `UTF-8` strings.

* ### Event: `'stdErr'`
    Same, but for `child_process.stderr`

```js
const Cwd = require('run-in-cwd');
const cwd = new Cwd('./path/to/dir');

const childProc = cwd.spawn('git', ['status']) 

let isClean = false;

childProc.on('stdOut', (lines) => {
    lines.forEach(line => {
        if (line.includes('nothing to commit')) {
            isClean = true;
        }
    });
})

childProc.on('close', (exitCode) => {
    if (exitCode === 0) { // 0 is like 200 OK. 
        console.log('Clean')
    }
    else {
        console.log('Stage & Commit')
    }
})
```

&nbsp;




--------------------------------
`run-in-cwd` vs. `child_process`
--------------------------------
When you need to run multiple commands on the same directory and it's not your *Current Working Directory*, you will find yourself repetitively using spawn's option `{cwd: 'path/to/the/same/dir/every/time'}`.

*With `CWD` you only do it once.*
```js
const childProc = require('child_process')
const Cwd = require('run-in-cwd')

// Node's child process
childProc.spawn('git', ['status'], {cwd: './sub-dir'})
childProc.spawn('git', ['add', '-A'], {cwd: './sub-dir'})
childProc.spawn('git', ['commit'], {cwd: './sub-dir'})

// run-in-cwd
const subDir = new Cwd('./my-folder')

subDir.spawn('git', ['status'])
subDir.spawn('git', ['add', '-A'])
subDir.spawn('git', ['commit'])
```

&nbsp;

When you want to run a simple command with a simple argument like: `ls -l` you would normally either (1) pass a command string AND an array with a single argument or (2) add the `{shell: true}` spawn option.

```js
const childProc = require('child_process')

// :(
childProc.spawn('ls', ['-l'])
childProc.spawn('ls -l', {shell: true})
```
With `run-in-cwd` you do it like:
```js
const Cwd = require('run-in-cwd')
const cwd = new Cwd();

// :D
cwd().spawn('ls -l')
```
The whole command string is split by spaces and then transformed into:
```js
.spawn('ls', ['-l'])
```

If you need a shell - use `spawnShell` instead of `spawn`:
```js
cwd.spawnShell('ls -l')
```

What is CWD?
------------
`CWD` stands for: Current Working Directory.  
When working with a Command Line Interface (CLI) you excecute commands from within a certain directory, your `code` folder, for example:
```sh
# Windows
C:\path\code\>

# Linux
~/path/code $
```
`run-in-cwd`'s original purpose was trying to make running commands in Node a bit more like that.




