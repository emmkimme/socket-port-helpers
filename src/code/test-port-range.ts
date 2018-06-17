import { TestPortOptions, TestPortResult } from './test-port';

export interface TestPortRangeOptions extends TestPortOptions {
    rangeSlice?: number;
}

export interface TestPortRangeFunction {
    (portRange: string, options?: TestPortRangeOptions): Promise<TestPortResult[]>;
}
