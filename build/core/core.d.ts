/// <reference types="node" resolution-mode="require"/>
import type { InputFiles } from "../types/index.js";
export default abstract class Core {
    constructor();
    abstract append(...buffers: Buffer[]): Promise<void>;
    abstract extend(...cors: unknown[]): void;
    abstract clone(): Core;
    abstract filter(): Promise<number>;
    abstract metadata(): Promise<unknown>;
    /**
     * load file from path
     */
    static loadFile<T extends string>(path: T): Promise<Buffer>;
    static loadFile<T extends string[]>(path: T): Promise<Buffer[]>;
    /**
     * load file from url
     */
    static loadUrl<T extends string | URL>(url: T): Promise<Buffer>;
    static loadUrl<T extends string[] | URL[]>(url: T): Promise<Buffer[]>;
    /**
     * Convert any of supported inputs to Buffer
     */
    static toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
    static toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
}
//# sourceMappingURL=core.d.ts.map