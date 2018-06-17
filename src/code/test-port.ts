export interface TestPortOptions {
    hostname?: string;
    log?: boolean;
    testConnection?: boolean;
    testDataToSocket?: boolean;
    testDataToServer?: boolean;
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
