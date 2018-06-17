# socket-port-helpers
A javascript helpers for socket.

# Features
* Test a port
* Look for one or multiple free port/s

# Installation
```Batchfile
npm install socket-port-helpers
```

Dependencies
* http://nodejs.org/
* https://github.com/YounGoat/nodejs.portman

# Test a port

```ts
interface TestPortOptions {
    hostname?: string;
    log?: boolean;
    testConnection?: boolean;       // Connect a socket
    testDataTransfer?: boolean;     // Send data to socket
    timeoutDelay?: number;          // Delay before stopping the test
}

function testPort(port: number, options?: TestPortOptions): Promise<number>;
```

# Test multiple ports

```ts
interface TestPortRangeOptions extends TestPortOptions {
    rangeSlice?: number;            // test of ports is divided in slice
}

interface TestRangeResult {
    port: number;
    err?: Error;
    errMsg?: string;
}

testPortRangeFunction(portRange: string, options?: TestPortRangeOptions): Promise<TestRangeResult[];

Thanks to the package [portman](https://github.com/YounGoat/nodejs.portman#portmanportrange),
the *portRange* argument supports following syntax :
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

```

# Find a free port

```ts
interface FindFreePortOptions extends TestPortOptions {
    portRange?: string;
}

function findFirstFreePort(options?: FindFreePortOptions): Promise<number>;
```

# Find multiple free ports

```ts
interface FindFreePortRangeOptions extends FindFreePortOptions {
}

function findFreePortRange(count: number, options?: FindFreePortOptions): Promise<number[]>;
```

# MIT License

Copyright (c) 2018 Emmanuel Kimmerlin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.