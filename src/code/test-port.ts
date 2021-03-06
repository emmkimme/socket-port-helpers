export interface TestPortOptions {
    hostname?: string;
    log?: boolean;
    testConnection?: boolean;
    testDataTransfer?: boolean;
    timeoutDelay?: number;
}

export interface TestPortResult {
    port: number;
    err?: Error;
    errMsg?: string;
}

export interface TestPortFunction {
    (port: number, options?: TestPortOptions): Promise<TestPortResult>;
}
