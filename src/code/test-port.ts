import * as net from 'net';

import { defaultTimeoutDelay, handshakeData } from './constants';

export interface TestPortOptions {
    hostname?: string;
    log?: boolean;
    testConnection?: boolean;
    testData?: boolean;
    timeoutDelay?: number;
}

export function testPort(port: number, options?: TestPortOptions): Promise<number> {
    options = options || {};
    options.timeoutDelay = options.timeoutDelay || defaultTimeoutDelay;
    options.testConnection = options.testConnection || options.testData;
    return new Promise<number>((resolve, reject) => {
        let server = net.createServer();
        let socket: net.Socket;
        let timer: NodeJS.Timer;

        let fulfilled = (success: boolean, msg: string) => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (socket) {
                socket.end();
                socket.unref();
                socket = null;
            }
            if (success) {
                options.log && console.log(msg);
                // Close the server before sending the success
                server.close(() => {
                    resolve(port);
                });
            }
            else {
                options.log && console.error(msg);
                server.close();
                reject(msg);
            }
        };

        timer = setTimeout(() => {
            timer = null;
            fulfilled(false, `Test port ${port} : server timeout ${options.timeoutDelay}ms`);
        }, options.timeoutDelay);

        server.addListener('listening', () => {
            if (!options.testConnection) {
                fulfilled(true, `Test port ${port} : server listening`);
                return;
            }
            options.log && console.log(`Test port ${port} : server listening`);
            options.log && console.log(`Test port ${port} : connect client`);
            socket = net.createConnection(port, options.hostname);
            if (options.testData) {
                socket.addListener('data', (buff: Buffer) => {
                    if (buff.toString() === handshakeData) {
                        fulfilled(true, `Test port ${port} : client receives correct data`);
                    }
                    else {
                        fulfilled(false, `Test port ${port} : client receives wrong data`);
                    }
                });
            }
            socket.addListener('end', () => {
                options.log && console.log(`Test port ${port} : client end`);
            });
            socket.addListener('close', (had_error: boolean) => {
                options.log && console.log(`Test port ${port} : client close (had error=${had_error})`);
            });
            socket.addListener('timeout', () => {
                fulfilled(false, `Test port ${port} : client timeout`);
            });
            socket.addListener('error', (err: Error) => {
                fulfilled(false, `Test port ${port} : client error ${err}`);
            });
        });
        server.addListener('connection', (socket: net.Socket) => {
            if (!options.testData) {
                fulfilled(true, `Test port ${port} : client connected`);
                return;
            }
            options.log && console.log(`Test port ${port} : client connected`);
            options.log && console.log(`Test port ${port} : server sends data`);
            let buff = Buffer.from(handshakeData);
            socket.write(buff);
        });
        server.addListener('close', (err: Error) => {
            options.log && console.log(`Test port ${port} : server close ${err ? err : ''}`);
        });
        server.addListener('error', (err: Error) => {
            fulfilled(false, `Test port ${port} : server error ${err ? err : ''}`);
        });
        options.log && console.log(`Test port ${port} -------------`);
        server.listen(port, options.hostname);
    });
}
