import { FindFreePortRangeFunction, FindFreePortRangeOptions } from './find-free-port-range';
import { testPort } from './test-port-impl';

import { basePort, basePortMax, defaultRangeSlice } from './constants';

const portman = require('portman');

function _findFreePortRange(count: number, range: any, options?: FindFreePortRangeOptions): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
        let outOfPorts = false;
        let promiseResults: Promise<number>[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            if (count === 0) {
                break;
            }
            let port = range.next();
            if (port == null) {
                outOfPorts = true;
                break;
            }
            let p = new Promise<number>((resolve, reject) => {
                testPort(port, options)
                .then((port) => {
                    resolve(port);
                })
                .catch((err) => {
                    resolve(null);
                });
            });
            promiseResults.push(p);
            ++port;
            --count;
        }
        if (promiseResults.length === 0) {
            return resolve([]);
        }
        return Promise.all(promiseResults)
        .then((results) => {
            results = results.filter(port => !!port);
            if (outOfPorts || (count === 0)) {
                resolve(results);
            }
            _findFreePortRange(count, range, options)
            .then((remainingResults) => {
                resolve(results.concat(remainingResults));
            });
        });
    });
}

export let findFreePortRange: FindFreePortRangeFunction = (count: number, options?: FindFreePortRangeOptions) => {
    options = options || {};
    options.portRange = options.portRange || `${basePort}-${basePortMax}`;
    options.rangeSlice = options.rangeSlice || defaultRangeSlice;
    return _findFreePortRange(count, new portman.PortRange(options.portRange), options);
}

