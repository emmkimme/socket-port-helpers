import { testPort, TestPortOptions } from './test-port';

// https://en.wikipedia.org/wiki/Ephemeral_port
let basePort: number = 49152;
let basePortMin: number = 0;
let basePortMax: number = 65534;
// function invert(p: Promise<any>): Promise<any> {
//     return new Promise<any>((res, rej) => p.then(rej, res));
// }

export interface FindFreePortOptions extends TestPortOptions {
    portMin?: number;
    portMax?: number;
}

function testPortRange(port: number, options?: FindFreePortOptions): Promise<number> {
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
            return testPortRange(port + 1, options);
        });
    }
    return Promise.resolve(0);
}

export function findFreePort(options?: FindFreePortOptions): Promise<number> {
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
    return testPortRange(options.portMin, options);
}
