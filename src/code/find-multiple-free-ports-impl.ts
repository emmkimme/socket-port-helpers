import { testPort } from './test-port-impl';
import { FindMultipleFreePortsFunction, FindMultipleFreePortsOptions } from './find-multiple-free-ports';
import { basePort, basePortMin, basePortMax, defaultRangeSlice } from './constants';


function _findMultipleFreePorts(count: number, port: number, options?: FindMultipleFreePortsOptions): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
        let outOfPorts = false;
        let promiseResults: Promise<number>[] = [];
        for (let i = 0, l = options.rangeSlice; i < l; ++i) {
            if (count === 0) {
                break;
            }
            if (port > options.portMax) {
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
            _findMultipleFreePorts(count, port, options)
            .then((remainingResults) => {
                resolve(results.concat(remainingResults));
            });
        });
    });
}

export let findMultipleFreePorts: FindMultipleFreePortsFunction = (count: number, options?: FindMultipleFreePortsOptions) => {
    options = options || {};
    options.portMin = (options.portMin == null) ? basePort : Math.max(basePortMin, options.portMin);
    if (options.portMax == null) {
        options.portMax = basePortMax;
    }
    else if (options.portMax >= 0) {
        options.portMax = Math.min(basePortMax, options.portMax);
    }
    else {
        options.portMax = Math.min(basePortMax, options.portMin - options.portMax);
    }
    options.rangeSlice = options.rangeSlice || defaultRangeSlice;
    return _findMultipleFreePorts(count, options.portMin, options);
}
