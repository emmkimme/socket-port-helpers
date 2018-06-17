import * as net from 'net';

import { defaultTimeoutDelay, handshakeData } from './constants';
import { TestPortFunction, TestPortOptions, TestPortResult } from './test-port';

export let testPort: TestPortFunction = (port: number, options?: TestPortOptions) => {
    options = options || {};
    options.timeoutDelay = options.timeoutDelay || defaultTimeoutDelay;
    options.testConnection = options.testConnection || options.testDataToSocket;
    return new Promise<TestPortResult>((resolve, reject) => {
        let server = net.createServer();
        let socket: net.Socket;
        let timer: NodeJS.Timer;

        let fulfilled = (success: boolean, msg: string, err?: Error) => {
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
                    resolve({ port });
                });
            }
            else {
                options.log && console.error(`${msg} - ${err}`);
                server.close();
                reject({ port, err, errMsg: msg });
            }
        };

        timer = setTimeout(() => {
            timer = null;
            fulfilled(false, `Port ${port} : server error`, new Error(`timeout ${options.timeoutDelay}ms`));
        }, options.timeoutDelay);

        // https://nodejs.org/api/net.html#net_event_listening
        server.addListener('listening', () => {
            if (!options.testConnection) {
                fulfilled(true, `Port ${port} : server listening`);
                return;
            }
            options.log && console.log(`Port ${port} : server listening`);
            options.log && console.log(`Port ${port} : connect socket`);
            socket = net.createConnection(port, options.hostname);
            if (options.testDataToSocket) {
                // https://nodejs.org/api/net.html#net_event_data
                socket.addListener('data', (buff: Buffer) => {
                    if (buff.toString() === handshakeData) {
                        fulfilled(true, `Port ${port} : socket receives correct data`);
                    }
                    else {
                        fulfilled(false, `Port ${port} : socket error`, new Error(`receives wrong data`));
                    }
                });
            }
            // https://nodejs.org/api/net.html#net_event_end
            socket.addListener('end', () => {
                options.log && console.log(`Port ${port} : socket end`);
            });
            // https://nodejs.org/api/net.html#net_event_close_1
            socket.addListener('close', (had_error: boolean) => {
                options.log && console.log(`Port ${port} : socket close (had error=${had_error})`);
            });
            // https://nodejs.org/api/net.html#net_event_timeout
            socket.addListener('timeout', () => {
                fulfilled(false, `Port ${port} : socket error`, new Error(`timeout`));
            });
            // https://nodejs.org/api/net.html#net_event_error_1
            socket.addListener('error', (err: Error) => {
                fulfilled(false, `Port ${port} : socket error`, err);
            });
        });
        // https://nodejs.org/api/net.html#net_event_connection
        server.addListener('connection', (socket: net.Socket) => {
            if (!options.testDataToSocket) {
                fulfilled(true, `Port ${port} : socket connected`);
                return;
            }
            options.log && console.log(`Port ${port} : socket connected`);
            options.log && console.log(`Port ${port} : server sends data to socket`);
            let buff = Buffer.from(handshakeData);
            socket.write(buff);
        });
        // https://nodejs.org/api/net.html#net_event_close
        server.addListener('close', () => {
            options.log && console.log(`Port ${port} : server close`);
        });
        // https://nodejs.org/api/net.html#net_event_error
        server.addListener('error', (err: Error) => {
            fulfilled(false, `Port ${port} : server error`, err);
        });
        options.log && console.log(`Port ${port} -------------`);
        server.listen(port, options.hostname);
    });
}

