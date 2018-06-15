import { TestPortRangeOptions } from './test-port-range';

export interface FindFreePortRangeOptions extends TestPortRangeOptions {
    portRange?: string;
}

export interface FindFreePortRangeFunction {
    (count: number, options?: FindFreePortRangeOptions): Promise<number[]>;
}
