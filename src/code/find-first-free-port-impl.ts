import { FindFirstFreePortFunction, FindFirstFreePortOptions } from './find-first-free-port';
import { testPort } from './test-port-impl';

import { basePort, basePortMax, defaultRangeSlice } from './constants';
import { PortRange } from './port-range';

function _findFirstFreePort(range: any, options: FindFirstFreePortOptions): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        const ports: number[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            const port = range.next();
            if (port == null) {
                break;
            }
            ports.push(port);
        }

        // Stop the recurrence no more ports to test
        if (ports.length === 0) {
            return resolve(null);
        }

        let counter = 0;
        const fullfilled = (value: number) => {
            if (value) {
                return resolve(value);
            }
            if (++counter >= ports.length) {
                // Stop the recurrence no more ports to test
                if (ports.length < options.rangeSlice) {
                    resolve(null);
                }
                else {
                    resolve(_findFirstFreePort(range, options));
                }
            }
        };

        for (let i = 0, l = ports.length; i < l; ++i) {
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
        }
    });
}


export const findFirstFreePort: FindFirstFreePortFunction = (options?: FindFirstFreePortOptions) => {
    options = options || {};
    options.portRange = options.portRange || `${basePort}-${basePortMax}`;
    if (!options.rangeSlice || (options.rangeSlice <= 0)) {
        options.rangeSlice = defaultRangeSlice;
    }
    return _findFirstFreePort(new PortRange(options.portRange), options);
}

