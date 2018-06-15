import { TestPortOptions } from './test-port';

export interface TestPortRangeOptions extends TestPortOptions {
    rangeSlice?: number;
}

export interface TestRangeResult {
    port: number;
    free: boolean;
    err?: Error;
    errMsg?: string;
}

export interface TestPortRangeFunction {
    (portRange: string, options?: TestPortRangeOptions): Promise<TestRangeResult[]>;
}
