import { FindFirstFreePortFunction, FindFirstFreePortOptions } from './find-first-free-port';
import { testPort } from './test-port-impl';

import { basePort, basePortMax, defaultRangeSlice } from './constants';

const portman = require('portman');

function _findFirstFreePort(range: any, options?: FindFirstFreePortOptions): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        let ports: number[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            let port = range.next();
            if (port == null) {
                break;
            }
            ports.push(port);
        }

        if (ports.length === 0) {
            return resolve(null);
        }

        let counter = 0;
        let fullfilled = (value: number) => {
            if (value) {
                return resolve(value);
            }
            if (++counter >= ports.length) {
                if (ports.length < options.rangeSlice) {
                    resolve(null);
                }
                else {
                    resolve(_findFirstFreePort(range, options));
                }
            }
        };

        let promiseResults: Promise<number>[] = [];
        for (let i = 0, l = ports.length; i < l; ++i) {
            let p = new Promise<number>((resolve, reject) => {
                testPort(ports[i], options)
                .then((portResult) => {
                    if (portResult.err) {
                        fullfilled(null);
                    }
                    else {
                        fullfilled(portResult.port);
                    }
                })
                .catch((err) => {
                    fullfilled(null);
                });
            });
            promiseResults.push(p);
        }
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

