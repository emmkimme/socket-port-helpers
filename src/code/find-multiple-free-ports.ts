import { testPort } from './test-port';
import { FindFreePortOptions } from './find-free-port';
import { basePort, basePortMin, basePortMax } from './constants';

export interface FindMultipleFreePortsOptions extends FindFreePortOptions {
}

function _findMultipleFreePorts(results: number[], port: number, options?: FindMultipleFreePortsOptions): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
        if (port <= options.portMax) {
            let promiseResults: Promise<number>[] = [];
            for (let i = 0, l = results.length; i < l; ++i) {
                if (results[i] == null) {
                    let p = new Promise<number>((resolve, reject) => {
                        testPort(port + i, options)
                        .then((port) => {
                            results[i] = port;
                            resolve();
                        })
                        .catch((err) => {
                            resolve();
                        });
                    });
                    promiseResults.push(p);
                }
            }
            if (promiseResults.length === 0) {
                return resolve(results);
            }
            return Promise.all(promiseResults)
            .then(() => {
                resolve(_findMultipleFreePorts(results, port + promiseResults.length, options));
            });
        }
        else {
            resolve(results);
        }
    });
}

export function findMultipleFreePorts(count: number, options?: FindMultipleFreePortsOptions): Promise<number[]> {
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
    let results: number[] = new Array(count);
    return _findMultipleFreePorts(results, options.portMin, options);
}
