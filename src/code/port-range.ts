function papply(fn: Function, rangePort: number) {
    return (realPort: number) => {
        return fn.call(null, rangePort, realPort);
    };
}

const coverFn: { [key: string]: Function } = {
    '!=': (rangePort: number, realPort: number) => realPort != rangePort,
    '>=': (rangePort: number, realPort: number) => realPort >= rangePort,
    '<=': (rangePort: number, realPort: number) => realPort <= rangePort,
    '>': (rangePort: number, realPort: number) => realPort > rangePort,
    '<': (rangePort: number, realPort: number) => realPort < rangePort,
    '=': (rangePort: number, realPort: number) => realPort == rangePort,
};

export class PortRange {
    private _orRangeJudgers: (number | Function[])[];
    private _cursor: number;

    constructor(rangeCode: string) {
        this._cursor = 0;
        this._orRangeJudgers = [];
        rangeCode.trim().split(/\|\||,/).forEach((code) => {
            code = code.trim().replace(/([!>=<])\s+/g, '$1').replace(/\s*-\s*/g, '-');
            const fns: Function[] = [];
            let parts = code.split(/\s+/);
            for (let i = 0; i < parts.length; i++) {
                let part = parts[i];
                let comparator: string;
                ['!=', '>=', '<=', '>', '<', '='].every((sign) => {
                    if (part.startsWith(sign)) {
                        comparator = sign;
                    }
                    return !comparator;
                });

                if (comparator) {
                    let rangePort = part.substr(comparator.length);
                    if (!/^\d+$/.test(rangePort)) {
                        throw new Error(`Invalid range number: ${rangePort}`);
                    }
                    fns.push(papply(coverFn[comparator], Number(rangePort)));
                }
                else if (/^(\d+)-(\d+)$/.test(part)) {
                    fns.push(
                        // This is an IIFE and the return value is an array function.
                        ((a, b) => /*return*/(port: number) => port >= a && port <= b)
                            (Number(RegExp.$1), Number(RegExp.$2))
                    );
                }
                else {
                    if (!/^\d+$/.test(part)) {
                        throw new Error(`Invalid range number: ${part}`);
                    }
                    this._orRangeJudgers.push(Number(part));
                }
            }
            if (fns.length) {
                this._orRangeJudgers.push(fns);
            }
        });
    }

    /**
     * Whether the range covers the port.
     * @param  {string|number} port
     * @return boolean
     */
    covers(portStrOrNum: string | number): boolean {
        const port = Number(portStrOrNum);
        let found = false;
        this._orRangeJudgers.every((judger) => {
            if (judger instanceof Array) {
                let matched = true;
                judger.every(fn => matched = fn(port));
                found = matched;
            }
            else {
                found = (judger == port);
            }
            return !found;
        });
        return found;
    };

    /**
     * Find the next port in the range.
     * @param  {string|number} [last] begin from the last port (excluded)
     * @return boolean
     */
    next(last?: string | number): number {
        let port = null;
        if (last != null) {
            this._cursor = Number(last);
        }
        while (this._cursor < 65536) {
            ++this._cursor;
            if (this.covers(this._cursor)) {
                port = this._cursor;
                break;
            }
        }
        return port;
    };

    reset() {
        this._cursor = 0;
    }
}

