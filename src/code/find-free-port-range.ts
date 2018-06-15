import { testPort, TestPortOptions } from './test-port';

import { basePort, basePortMax } from './constants';

const portman = require('portman');

export interface FindFreePortRangeOptions extends TestPortOptions {
    rangePort?: string;
}

function testMultiplePortsRange(results: number[], range: any, options?: FindFreePortRangeOptions): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
        let outOfPorts = false;
        let promiseResults: Promise<number>[] = [];
        for (let i = 0, l = results.length; i < l; ++i) {
            if (results[i] == null) {
                let port = range.next();
                if (port == null) {
                    outOfPorts = true;
                    break;
                }
                let p = new Promise<number>((resolve, reject) => {
                    testPort(port, options)
                    .then((port) => {
                        results[i] = port;
                        resolve();
                    })
                    .catch((err) => {
                        resolve();
                    });
                });
                promiseResults.push(p);
            }
        }
        if (promiseResults.length === 0) {
            return resolve(results);
        }
        return Promise.all(promiseResults)
        .then(() => {
            if (outOfPorts) {
                resolve(results);
            }
            else {
                resolve(testMultiplePortsRange(results, range, options));
            }
        });
    });
}

export function findFreePortRange(count: number, options?: FindFreePortRangeOptions): Promise<number[]> {
    options = options || {};
    options.rangePort = options.rangePort || `${basePort}-${basePortMax}`;
    let results: number[] = new Array(count);
    return testMultiplePortsRange(results, new portman.PortRange(options.rangePort), options);
}

