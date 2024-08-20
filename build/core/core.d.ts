/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import stream from "node:stream";
export default abstract class Core {
    constructor();
    abstract get length(): number;
    abstract append(...buffers: Buffer[]): Promise<number>;
    abstract extend(...cors: unknown[]): number;
    abstract clone(): Core;
    abstract clean(): void;
    abstract filter(): Promise<number>;
    abstract metadata(): Promise<unknown>;
    /**
     * @param readable - input
     * @param writable - output or middleware
     *
     * @example
     * ```js
     *  const writable = Core.stream(readable, transform)
     *  // => Writable
     *
     *  writable.pipe(output)
     * ```
     */
    static stream(readable: stream.Readable, writable: stream.Writable): stream.Writable;
}
//# sourceMappingURL=core.d.ts.map