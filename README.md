# socket-port-helpers
A javascript helpers for socket.

# Features
* Test one or multiple port/s
* Look for one or multiple free port/s
* port range parser

# Installation
```Batchfile
npm install socket-port-helpers
```

Dependencies
* http://nodejs.org/
* https://github.com/YounGoat/nodejs.portman

# Samples

Find the first free port available (test data transfer)
```js
const socketPortHelper = require('socket-port-helpers');

socketPortHelper.findFirstFreePort({ testDataTransfer: true, log: false })
    .then((port) => {
    console.log(`first free port ${port}`);
    })
    .catch((err) => {
    });
});
 ```

Find 20 free ports in the range [7000-8000]. 5 Ports are tested in parallel.
```js
const socketPortHelper = require('socket-port-helpers');

socketPortHelper.findFreePortRange(20, { portRange:'7000-8000', log: false, rangeSlice: 5 })
.then((ports) => {
    for (let i = 0, l = ports.length ; i < l; ++i) {
        console.log(`${i} - find free port ${ports[i]}`);
    }
 })
 .catch((err) => {
 });
 ```


# Test a port

```ts
interface TestPortResult {
    port: number;
    err?: Error;        // If the port is not reachable on time, this member contains the error
    errMsg?: string;
}

interface TestPortOptions {
    hostname?: string;
    log?: boolean;
    testConnection?: boolean;       // Connect a socket
    testDataTransfer?: boolean;     // Send data to socket
    timeoutDelay?: number;          // Delay before stopping the test (default is 500ms)
}

function testPort(port: number, options?: TestPortOptions): Promise<TestPortResult>;
```

# Test multiple ports

```ts
interface TestPortRangeOptions extends TestPortOptions {
    rangeSlice?: number;            // test [n] ports in parallel (default is 5)
}

testPortRange(portRange: string, options?: TestPortRangeOptions): Promise<TestRangeResult[];
```

Inspired from the package [portman](https://github.com/YounGoat/nodejs.portman#portmanportrange "portman"), the *portRange* argument supports following syntax :
*   single port  
    `'8080'`
*   ports  
    `'80 443 8080 8443'`
*   port prefixed with comparator  
    `'!=8080'`  
    `'>=8000'`  
    ...  
*   hyphenated ports  
    `'7000 - 8000'`
*   combination of previous  
    `'8080 8443 >=9000'`  
    `'<4000 || >=6000'`  

default range is [49152 - 65534]

# Find a free port

```ts
interface FindFirstFreePortOptions extends TestPortOptions {
    portRange?: string;
}

function findFirstFreePort(options?: FindFirstFreePortOptions): Promise<number>;
```
Returns *null* if failed to find a free port else the free port number.

# Find multiple free ports

```ts
interface FindFreePortRangeOptions extends FindFreePortOptions {
}

function findFreePortRange(count: number, options?: FindFreePortRangeOptions): Promise<number[]>;
```
The returned array length is shorter than *count*, if we can not find the expected number of free ports.

# MIT License

Copyright (c) 2021 Emmanuel Kimmerlin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.