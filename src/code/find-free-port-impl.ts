import { testPort } from './test-port-impl';

import { FindFreePortFunction, FindFreePortOptions } from './find-free-port';

import { basePort, basePortMin, basePortMax } from './constants';


// function invert(p: Promise<any>): Promise<any> {
//     return new Promise<any>((res, rej) => p.then(rej, res));
// }

function _findFreePort(port: number, options?: FindFreePortOptions): Promise<number> {
    if (port <= options.portMax) {
        // const subRange = 5;
        // let promisePorts: Promise<number>[] = [];
        // let portRange = Math.min(portStart + subRange, portMax);
        // for (; portStart < portRange; ++portStart) {
        //     promisePorts.push(testPort(portStart));
        // }
        // return invert(Promise.all(promisePorts.map(invert)))
        return testPort(port, options)
        .then((port) => {
            return port;
        })
        .catch((err) => {
            return _findFreePort(port + 1, options);
        });
    }
    return Promise.resolve(0);
}

export let findFreePort: FindFreePortFunction = (options?: FindFreePortOptions) => {
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
    return _findFreePort(options.portMin, options);
}

