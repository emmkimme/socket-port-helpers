import { testPort, TestPortOptions } from './test-port';

import { basePort, basePortMax, defaultRangeSlice } from './constants';

const portman = require('portman');

export interface TestPortRangeOptions extends TestPortOptions {
    rangeSlice?: number;
}

export interface TestRangeResult {
    port: number;
    free: boolean;
    err?: string;
}

export interface TestRangeResults {
    results: TestRangeResult[];
}

function _testPortRange(results: TestRangeResults, range: any, options?: TestPortRangeOptions): Promise<TestRangeResults> {
    return new Promise<TestRangeResults>((resolve, reject) => {
        let outOfPorts = false;
        let promiseResults: Promise<number>[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            let port = range.next();
            if (port == null) {
                outOfPorts = true;
                break;
            }
            let p = new Promise<number>((resolve, reject) => {
                testPort(port, options)
                .then((port) => {
                    results.results.push({port, free: true });
                    resolve();
                })
                .catch((err) => {
                    results.results.push({ port, free: false, err });
                    resolve();
                });
            });
            promiseResults.push(p);
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
                resolve(_testPortRange(results, range, options));
            }
        });
    });
}

export function testPortRange(portRange: string, options?: TestPortRangeOptions): Promise<TestRangeResults> {
    options = options || {};
    portRange = portRange || `${basePort}-${basePortMax}`;
    options.rangeSlice = options.rangeSlice || defaultRangeSlice;
    let results: TestRangeResults = { results: [] };
    return _testPortRange(results, new portman.PortRange(portRange), options);
}

