CWD
===
A wrapper around Node's `child_process.spawn()`.


* When you need to run multiple commands on the same directory and it's not your *Current Working Directory*, you will find yourself repetitively using spawn's option `{cwd: 'path/to/the/same/dir/every/time'}`.

*With `CWD` you only do it once.*

* When you want to run a simple command with a simple argument like: `ls -l` you would normally either (1) pass a command string AND an array with a single argument or (2) add the `{shell: true}` spawn option.

*`CWD` will spawn a process with a shell for you when it sees that space.*

```js
// :(
.spawn('ls', ['-l'])
.spawn('ls -l', {shell: true})

// :D
.spawn('ls -l')
```




* The spawned process can emits arrays of lines (UTF-8 only, for now)
## Install
**\<NOT PUBLISHED YET\>**

## Require & Create Instance
```js
const projectDir = require('CWD')('./path/to/project/folder')
```

***NOTE:** Cwd constructor checks path existance synchronously and throws an error if path not found.*

## TL;DR Example
```js
/* 1. spawn */
    const childProc = projectDir.spawn('git status')
    const childProc = projectDir.spawn('git pull', ['origin', 'master'])

/* 2. runCmd */
    projectDir.runCmd('git status')
        .then(([isOk, stdout, stderr]) => {
            // ...
        });
    
    // or within an async function:
    const [isOk, stdout, stderr] = await projectDir.runCmd('git status')
```


Instance API
============
## **.runCmd(** cmd, [args, [options]] **)**
Is similar to Node's `child_process.exec` and `child_process.execFile` ([see docs](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)). It is a higher level of `.spawn()` that handles the child process and returns results on command completion (or when an exception is thrown). Take care of errors by using `promise.catch()` or wrap with a `try-catch`.

**Arguments:**
* **cmd** *(Required)* - A command string e.g. `'git status'`
* **args** - An array of the command's arguments e.g. `['-flag', 'cache=500']`
* **options** - spawn options object, [see Node's docs](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

**Returns:** A promise for the command results.

The result is an array with 3 items:
1. isOk: Boolean - `true` if command exit code is 0. `false` otherwise.
2. stdout: String - The process `stdout` string
3. stderr: String - The process `stderr` string

***NOTE 1:** Those strings are buffered and has a max limit of 200 * 1024 bytes.*  
***NOTE 2:** Currently the output is `UTF-8` encoded.*

**Examples:**  
Promise Style:
```js
const cwd = require('cwd')('./path/to/dir')

cwd.runCmd('git status')
    .then(([isOk, stdout, stderr]) => {
        // ...
    })
    .catch((ex) => {
        // handle exception...
    });
```

Async-Await Style:
```js
const cwd = require('cwd')('./path/to/dir')

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


## **.spawn(** cmd, [args, [options]] **)**
Very much like [Node's child_process.spawn()](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).
It runs a command and returns a child process object which is an `Event Emitter`. You can listen to its different lifecycle events (`'close'`, `'error'` etc.)

***NOTE:** It is highly recommended to listen to the `'error'` event.*  

**Arguments:**
* **cmd** *(Required)* - A command string e.g. `'git status'`
* **args** - An array of the command's arguments e.g. `['-flag', 'cache=500']`
* **options** - spawn options object, [see Node's docs](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)

**Returns:** \<child_process\>

**Examples:**  
Calling `.spawn()` is only the first part of spawning a process. We then need to handle the returned process's events.

First, spawn a child process:
```js
const cwd = require('cwd')('./path/to/dir')

// Simple command
const cp = cwd.spawn('ls')

// With arguments
const cp = cwd.spawn('git status') // (spawns a shell)

// you can also do:
const cp = cwd.spawn('git', ['status']) // (doesn't spawn a shell)
```

### **\<child_process\>**
The returned object is Node's native [`ChildProcess`](https://nodejs.org/api/child_process.html#child_process_class_childprocess) with some extra events.

### Event: `'stdOut'`
* Is triggered when `child_process.stdout.on('data')` is triggered (excluding empty lines).
The event data is the `stdout` split into an array.

### Event: `'stdErr'`
* The same, but for `child_process.stderr.on('data')`

**Examples:**  
```js
const cwd = require('cwd')('./path/to/dir')

const cp = cwd.spawn('git', ['status']) 

cp.on('error', (err) => {
    // handle errors
})

let isClean = false

cp.on('stdOut', (lines) => {
    lines.forEach(line => {
        if (line.includes('nothing to commit')) {
            isClean = true;
        }
    });
})

cp.on('close', (exitCode) => {
    if (exitCode === 0) { // 0 is like 200 OK. 
        console.log('Clean')
    }
    else {
        console.log('Stage & Commit')
    }
})

```







### **ATTENTION:** If you let your users pass in the command and/or any of its arguments - __don't__. But if you do, make sure they are safe and valid and don't forget to handle errors.





`cwd` stands for: Current Working Directory.
When working with a Command Line Interface (CLI) you excecute commands from within a certain directory, your `code` folder, for example:
```sh
# Windows
C:\code\> dir

# Linux
~/code $ ls
```



