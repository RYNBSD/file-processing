/// <reference types="node" resolution-mode="require"/>
export default abstract class Core {
    constructor();
    abstract filter(): Promise<number>;
    abstract check(): Promise<void>;
    abstract clone(): Core;
    abstract metadata(): Promise<unknown>;
    /**
     * load file from path
     */
    static loadFile(path: string): Promise<Buffer>;
    /**
     * load file from url
     */
    static loadUrl<T extends string | URL>(url: T): Promise<Buffer>;
}
//# sourceMappingURL=core.d.ts.map