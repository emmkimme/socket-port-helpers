import { testPort } from './test-port-impl';

import { TestPortRangeFunction, TestPortRangeOptions} from './test-port-range';
import { TestPortResult } from './test-port';
import { basePort, basePortMax, defaultRangeSlice } from './constants';
import { PortRange } from './port-range';

function _testPortRange(results: TestPortResult[], range: any, options: TestPortRangeOptions): Promise<TestPortResult[]> {
    return new Promise<TestPortResult[]>((resolve, reject) => {
        let outOfPorts = false;
        const promiseResults: Promise<void>[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            let port = range.next() as number;
            if (port == null) {
                outOfPorts = true;
                break;
            }
            const p = new Promise<void>((resolve, reject) => {
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

export const testPortRange: TestPortRangeFunction = (portRange: string, options?: TestPortRangeOptions) => {
    options = options || {};
    portRange = portRange || `${basePort}-${basePortMax}`;
    if (!options.rangeSlice || (options.rangeSlice <= 0)) {
        options.rangeSlice = defaultRangeSlice;
    }
    const results: TestPortResult[] = [];
    return _testPortRange(results, new PortRange(portRange), options);
}

