import { testPort } from './test-port-impl';

import { TestPortRangeFunction, TestRangeResult, TestPortRangeOptions} from './test-port-range';
import { basePort, basePortMax, defaultRangeSlice } from './constants';

const portman = require('portman');

function _testPortRange(results: TestRangeResult[], range: any, options?: TestPortRangeOptions): Promise<TestRangeResult[]> {
    return new Promise<TestRangeResult[]>((resolve, reject) => {
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
                    results.push({port, free: true });
                    resolve();
                })
                .catch((err) => {
                    results.push({ port, free: false, err, errMsg: err.message });
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
    options.rangeSlice = options.rangeSlice || defaultRangeSlice;
    let results: TestRangeResult[] = [];
    return _testPortRange(results, new portman.PortRange(portRange), options);
}

