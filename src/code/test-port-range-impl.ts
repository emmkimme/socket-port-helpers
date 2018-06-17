import { testPort } from './test-port-impl';

import { TestPortRangeFunction, TestPortRangeOptions} from './test-port-range';
import { TestPortResult } from './test-port';
import { basePort, basePortMax, defaultRangeSlice } from './constants';

const portman = require('portman');

function _testPortRange(results: TestPortResult[], range: any, options?: TestPortRangeOptions): Promise<TestPortResult[]> {
    return new Promise<TestPortResult[]>((resolve, reject) => {
        let outOfPorts = false;
        let promiseResults: Promise<number>[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            let port = range.next() as number;
            if (port == null) {
                outOfPorts = true;
                break;
            }
            let p = new Promise<number>((resolve, reject) => {
                testPort(port, options)
                .then((portResult) => {
                    results.push(portResult);
                    resolve();
                })
                .catch((err) => {
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

export let testPortRange: TestPortRangeFunction = (portRange: string, options?: TestPortRangeOptions) => {
    options = options || {};
    portRange = portRange || `${basePort}-${basePortMax}`;
    if (!options.rangeSlice || (options.rangeSlice <= 0)) {
        options.rangeSlice = defaultRangeSlice;
    }
    let results: TestPortResult[] = [];
    return _testPortRange(results, new portman.PortRange(portRange), options);
}

