import { FindFreePortOptions } from './find-free-port';


export interface FindMultipleFreePortsOptions extends FindFreePortOptions {
    rangeSlice?: number;
}

export interface FindMultipleFreePortsFunction {
    (count: number, options?: FindMultipleFreePortsOptions): Promise<number[]>;
}
