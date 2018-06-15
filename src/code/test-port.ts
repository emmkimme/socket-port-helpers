export interface TestPortOptions {
    hostname?: string;
    log?: boolean;
    testConnection?: boolean;
    testData?: boolean;
    timeoutDelay?: number;
}

export interface TestPortFunction {
    (port: number, options?: TestPortOptions): Promise<number>;
}
