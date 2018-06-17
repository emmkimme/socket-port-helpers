import { TestPortRangeOptions } from './test-port-range';


export interface FindFirstFreePortOptions extends TestPortRangeOptions {
    portRange?: string;
}

export interface FindFirstFreePortFunction {
    (options?: FindFirstFreePortOptions): Promise<number>;
}
