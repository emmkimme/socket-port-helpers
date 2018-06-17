import { FindFreePortRangeFunction, FindFreePortRangeOptions } from './find-free-port-range';
import { findFirstFreePort } from './find-first-free-port-impl';
import { testPort } from './test-port-impl';

import { basePort, basePortMax, defaultRangeSlice } from './constants';

const portman = require('portman');


function _findFreePort(remainingCount: number, range: any, options?: FindFreePortRangeOptions): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
        let outOfPorts = false;
        let promiseResults: Promise<number>[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            if (remainingCount === 0) {
                break;
            }
            let port = range.next();
            if (port == null) {
                outOfPorts = true;
                break;
            }
            let p = new Promise<number>((resolve, reject) => {
                testPort(port, options)
                .then((portResult) => {
                    if (portResult.err) {
                        resolve(null);
                    }
                    else {
                        resolve(portResult.port)
                    }
                })
                .catch((err) => {
                });
            });
            promiseResults.push(p);
            --remainingCount;
        }
        if (promiseResults.length === 0) {
            return resolve([]);
        }
        return Promise.all(promiseResults)
        .then((results) => {
            results = results.filter(port => !!port);
            if (outOfPorts || (remainingCount === 0)) {
                resolve(results);
            }
            _findFreePort(remainingCount, range, options)
            .then((remainingResults) => {
                resolve(results.concat(remainingResults));
            });
        });
    });
}

export let findFreePortRange: FindFreePortRangeFunction = (count: number, options?: FindFreePortRangeOptions) => {
    options = options || {};
    options.portRange = options.portRange || `${basePort}-${basePortMax}`;
    if (!options.rangeSlice || (options.rangeSlice <= 0)) {
        options.rangeSlice = defaultRangeSlice;
    }
    if (count <= 0) {
        count = 1;
    }
    if (count === 1) {
        return findFirstFreePort(options)
        .then((port) => {
            return [port];
        });
    }
    else {
        return _findFreePort(count, new portman.PortRange(options.portRange), options);
    }
}
