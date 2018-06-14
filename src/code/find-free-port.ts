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

function testPortRange(options?: FindFreePortOptions): Promise<number> {
    if (options.portMin <= options.portMax) {
        // const subRange = 5;
        // let promisePorts: Promise<number>[] = [];
        // let portRange = Math.min(portStart + subRange, portMax);
        // for (; portStart < portRange; ++portStart) {
        //     promisePorts.push(testPort(portStart));
        // }
        // return invert(Promise.all(promisePorts.map(invert)))
        return testPort(options.portMin, options)
        .then((port) => {
            return port;
        })
        .catch((err) => {
            options.portMin += 1;
            return testPortRange(options);
        });
    }
    return Promise.resolve(0);
}

export function findFreePort(options?: FindFreePortOptions): Promise<number> {
    let localOptions: FindFreePortOptions = {};
    localOptions.portMin = (options.portMin == null) ? basePort : Math.max(basePortMin, options.portMin);
    localOptions.portMax = (options.portMax == null) ? basePortMax : Math.min(basePortMax, options.portMax);
    localOptions.log = options.log;
    return testPortRange(localOptions);
}
