import { FindFirstFreePortFunction, FindFirstFreePortOptions } from './find-first-free-port';
import { testPort } from './test-port-impl';

import { basePort, basePortMax, defaultRangeSlice } from './constants';

const portman = require('portman');


function invert(p: Promise<any>): Promise<any> {
    return new Promise<any>((res, rej) => p.then(rej, res));
}

function _findFirstFreePort(range: any, options?: FindFirstFreePortOptions): Promise<number> {
    return new Promise<number>((resolve, reject) => {
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
                .then((portResult) => {
                    if (portResult.err) {
                        reject(portResult.err);
                    }
                    else {
                        resolve(portResult.port)
                    }
                })
                .catch((err) => {
                    reject(err);
                });
            });
            promiseResults.push(p);
        }
        if (promiseResults.length === 0) {
            return resolve(null);
        }
        return invert(Promise.all(promiseResults.map(invert)))
        .then((port) => {
            resolve(port);
        })
        .catch((err) => {
            if (outOfPorts) {
                resolve(null);
            }
            else {
                resolve(_findFirstFreePort(range, options));
            }
        });
    });
}


export let findFirstFreePort: FindFirstFreePortFunction = (options?: FindFirstFreePortOptions) => {
    options = options || {};
    options.portRange = options.portRange || `${basePort}-${basePortMax}`;
    if (!options.rangeSlice || (options.rangeSlice <= 0)) {
        options.rangeSlice = defaultRangeSlice;
    }
    return _findFirstFreePort(new portman.PortRange(options.portRange), options);
}

