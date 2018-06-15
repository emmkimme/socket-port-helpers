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

# Test a port

```ts
export interface TestPortOptions {
    hostname?: string;
    log?: boolean;
    testConnection?: boolean;
    testData?: boolean;
}

export function testPort(port: number, options?: TestPortOptions): Promise<number>;
```

# Find a free port

```ts
export interface FindFreePortOptions extends TestPortOptions {
    portMin?: number;
    portMax?: number;
}

export function findFreePort(options?: FindFreePortOptions): Promise<number>;
```

# Find multiple free ports

```ts
export interface FindMultipleFreesPortOptions extends FindFreePortOptions {
}

export function findMultipleFreePorts(count: number, options?: FindFreePortOptions): Promise<number[]>;
```

# MIT License

Copyright (c) 2018 Emmanuel Kimmerlin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.