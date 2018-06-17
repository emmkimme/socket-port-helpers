import { FindFirstFreePortOptions } from './find-first-free-port';


export interface FindFreePortRangeOptions extends FindFirstFreePortOptions {
}

export interface FindFreePortRangeFunction {
    (count: number, options?: FindFreePortRangeOptions): Promise<number[]>;
}
