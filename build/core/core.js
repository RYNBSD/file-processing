export default class Core {
    constructor() { }
    // abstract stream(): Promise<void>;
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
    static stream(readable, writable) {
        return readable.pipe(writable);
    }
}
//# sourceMappingURL=core.js.map