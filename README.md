run-in-cwd
==========
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/cwd.svg?branch=master)](https://travis-ci.org/taitulism/cwd)

Run CLI commands with Node.

## Table Of Contents
* [Get Started](#get-started)  
* [Default Instance](#default-instance)  
* [API](#instance-api)


## Get Started
1. Install:
    ```sh
    $ npm install run-in-cwd
    ```
2. Require:
    ```js
    const createCwd = require('run-in-cwd')
    ```
3. Get a `Cwd` Instance:
    ```js
    const projectDir = createCwd('/path/to/target/folder')
    ```
4. Run a command:
    ```js
    // run to completion
    projectDir.runCmd('git status').then((results) => {...})

    // run with more control
    projectDir.spawn('git status')
        .on('line/out', (line) => {...})
        .on('close', (exitCode) => {...})
    ```

&nbsp;

>**WARNING:** If you let your users pass in the command and/or any of its arguments - make sure they are safe.


&nbsp;

## Default Instance
`run-in-cwd` exports a default instance you could use if your target folder is in which the current process runs in. Meaning, what `process.cwd()` returns.
```js
const cwd = require('run-in-cwd');

cwd.runCmd('git status').then(...)
```

It's the same instance you would get if you run `createCwd('./')`
```js
const createCwd = require('run-in-cwd');
const thatFolder = createCwd('./');

cwd.runCmd('git status').then(...)
```

**NOTE:** Do not extract cwd methods when requiring:
```js
// DO NOT:
const {runCmd} = require('run-in-cwd')
```


## Instance API

* [.runCmd](#runcmd-cmd-args-options--)
* [.spawn](#spawn-cmd-args-options--)
* [<child_process>](#child_process)
* [.runShellCmd](#runShellCmd-cmd-args-options--)
* [.spawnShell](#spawnshell-cmd-args-options--)
* [.parentProcess](#parent-process)


------------------------------------------------------------
### **.runCmd(** cmd, [args, [options] ] **)**
------------------------------------------------------------
Executes a command and returns a promise that resolves when the command exits.  
Similar to Node's `child_process.exec` and `child_process.execFile` ([see docs](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)). 

Don't forget to handle errors with `promise.catch()` or a `try-catch` wrapper.

**Arguments:**
* **cmd** *(Required)* - A command string (e.g. `'npm'`)
* **args** - An array of the command's arguments (e.g. `['-flag', 'key=value']`). Could also be a string or a number for a single argument.
> NOTE: `cmd` string could also include the arguments e.g. `.runCmd('npm install')`
* **options** - spawn options object. [See Node's docs](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).  
Additional option:
    * `maxCacheSize` - Limit the command cache in MegaBytes. The limit is the total output for both `stdout` & `stderr` streams. Default value is `10`. An exception is thrown when max size is exceeded.  
        ```js
        myDir.runCmd('cat logFile.txt', {maxCacheSize: 20}) // 20 MB limit
        ```


**Returns:** A promise for the command results.

The promised result is an object with the following properties:  
* **`exitCode`** - Number - The command exit code.
* **`isOk`** - Boolean - `true` if command exit code is 0. `false` otherwise.
* **`stdout`** - String - The commands's `stdout` output string (utf-8 encoded).
* **`stderr`** - String - The commands's `stderr` output string (utf-8 encoded).
* **`output`** - String - Both streams' output string (utf-8 encoded).
* **`stdoutLines`** - Array - The commands's `stdout` output, split to lines.
* **`stderrLines`** - Array -The commands's `stderr` output, split to lines.
* **`outputLines`** - Array - Both streams' output, split to lines.

**Examples:**  
First, create an instance:
```js
const Cwd = require('run-in-cwd');
const projectDir = new Cwd('./path/to/project');
```

Use Promise Style:
```js
projectDir.runCmd('npm install')
    .then({isOk, stderr} => {
        // ...
    })
    .catch((err) => {
        // handle exception...
    });
```

Use with Async-Await:
```js
(async () => { // `await` only runs inside async functions
    try {
        const {isOk, stdoutLines} = await projectDir.runCmd('npm install')

        // ...
    }
    catch (ex) {
        // handle exception...
    }
})();
```


## The difference between `!isOk` (not ok) and `exception`:
A CLI command has two output channels it can use to communicate with the process who ran it: one for the command's standard output (`stdout`), and one for its errors (`stderr`).
It can also utilize an exit code for when it completes. The consensus is exit code `0` for success (a kind of a "200 OK" HTTP response status code) and non-zero otherwise.

Each command can utilize those channels and exit codes differently, even "incorrectly" as there is no standard other than subjective common sense...

So when a command fails it will probably send some details through its `stderr` channel and exit with a non-zero exit code but it **will** be completed. No errors will be thrown in the Node process that executed the command.

An `exception` is thrown when there was a problem with the command **execution** in our environment. For example when the command itself is not found (e.g. a typo like `ggit` instead of `git`) or when the command tries to write stuff but you have no free storage, etc.

&nbsp;

&nbsp;




------------------------------------------------------------
### **.spawn(** cmd, [args, [options] ] **)**
------------------------------------------------------------
Runs a command and returns a child process with some extra events.

> It is highly recommended to handle errors:
```js
childProc.on('error', (err) => { /* handle error */ })
```

**Arguments:**
* **cmd** *(Required)* - A command string (e.g. `'npm'`)
* **args** - An array of the command's arguments (e.g. `['-flag', 'cache=500']`). Could also be a string or a number for a single argument.
> NOTE: `cmd` string could also include the arguments e.g. `.spawn('npm install')`
* **options** - spawn options object. [See Node's docs](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

**Returns:** \<child_process\>

**Examples:**  
Calling `.spawn()` is only the first part of spawning a process. We then need to handle the returned process's lifecycle events.

First, spawn a child process:
```js
const childProc = cwd.spawn('npm install --save')
```

&nbsp;

**\<child_process\>**
---------------------
`.spawn`'s return object is [Node's native ChildProcess](https://nodejs.org/api/child_process.html#child_process_class_childprocess) with some extra events.

* ### Event: `'line'`
    Is triggered for each line of both `stdout` and `stderr` streams. Buffers data chunks and emits a `line` event for every newline character (`\n`). Ignores empty lines.

* ### Event: `'line/out'`
    Same as `line` event, but for `stdout` only.
    
* ### Event: `'line/err'`
    Same as `line` event, but for `stderr` only.


```js
const Cwd = require('run-in-cwd');
const cwd = new Cwd('./path/to/dir');

const childProc = cwd.spawn('git status') 

let isClean = false;

childProc.on('line/out', (line) => {
    if (line.includes('nothing to commit')) {
        isClean = true;
    }
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


------------------------------------------------------------
### **.runShellCmd(** cmd, [args, [options] ] **)**
### **.spawnShell(** cmd, [args, [options] ] **)**
------------------------------------------------------------
Those are the shelled versions of `.runcCmd()` and `.spawn()`, respectivly. Meaning, the option `{shell: true}` is used. Use the shelled versions when you need to chain commands, redirect I/O, file globbing patterns and other shell behvior.

For example: 
```js
cwd.runShellCmd('git commit -m "nice feature" && git status 1>last-status.txt')
```

&nbsp;


------------------------------------------------------------
### **.parentProcess**
------------------------------------------------------------

Returns a cwd instance that redirects all of its commands' I/O to its parent process. It utilizes Node's `{stdio:inherit}` option. [Read more](https://nodejs.org/api/child_process.html#child_process_options_stdio).

```js
cwd.parentProcess.runCmd('git status')
```
Is the equivalent of:
```js
cwd.runCmd('git status', {stdio: 'inherit'})
```

>**NOTE:** All `cwd` instances (including the default instance) have the `.parentProcess` prop.

When the parent process is Node's global `process` object, it usually means write output to the terminal screen and read input from the keyboard. In this case the above code acts just like running `git status` from the terminal yourself.


&nbsp;


--------------------------------
`run-in-cwd` vs. `child_process`
--------------------------------
When you need to run multiple commands on the same directory and it's not your *Current Working Directory*, you will find yourself repetitively using spawn's option: `{cwd: 'path-to/my-folder'}`. With `CWD` you only do it once.

Node's child process:
```js
const childProc = require('child_process')

childProc.spawn('git', ['status'], {cwd: '../path-to/my-folder'})
childProc.spawn('git', ['commit'], {cwd: '../path-to/my-folder'})
childProc.spawn('git', ['add', '-A'], {cwd: '../path-to/my-folder'})
```

run-in-cwd:
```js
const Cwd = require('run-in-cwd')
const myFolder = new Cwd('../path-to/my-folder')

myFolder.spawn('git', 'status')
myFolder.spawn('git', 'add', '-A')
myFolder.spawn('git', 'commit')
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
When working with a Command Line Interface (CLI) you execute commands from within a certain directory, your `code` folder, for example:
```sh
# Windows
C:\path\code\>

# Linux
~/path/code $
```
`run-in-cwd`'s original purpose was trying to make running commands in Node a bit more like that.




