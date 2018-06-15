import { TestPortOptions } from './test-port';

export interface FindFreePortOptions extends TestPortOptions {
    portMin?: number;
    portMax?: number;
}

export interface FindFreePortFunction {
    (options?: FindFreePortOptions): Promise<number>;
}

