/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { InputFiles } from "../types/index.js";
import { Readable, type Writable } from "node:stream";
import { default as fastGlob } from "fast-glob";
import puppeteer from "puppeteer";
export default abstract class Core {
    constructor();
    abstract get length(): number;
    abstract append(...buffers: Buffer[]): Promise<number>;
    abstract extend(...cors: unknown[]): number;
    abstract clone(): Core;
    abstract filter(): Promise<number>;
    abstract metadata(): Promise<unknown>;
    static stream(readable: Readable, writable: Writable): Writable;
    static initBrowser(options?: puppeteer.PuppeteerLaunchOptions): Promise<puppeteer.Browser>;
    /**
     *  load file
     *
     * @example
     * ```js
     *  const files = Core.loadFile(["/file.txt", "/image.png"])
     *  // => Buffer[]
     *
     *  const file = Core.loadFile("/file.txt")
     *  // => Buffer
     * ```
     */
    static loadFile<T extends string>(paths: T): Promise<Buffer>;
    static loadFile<T extends string[]>(paths: T): Promise<Buffer[]>;
    /**
     *  load files from directory
     *
     * @example
     * ```js
     *  const files = Core.loadDir(["/dir1", "/dir2"])
     *  // => Buffer[][]
     *
     *  const file = Core.loadDir("/dir")
     *  // => Buffer[]
     * ```
     */
    static loadDir<T extends string>(paths: T): Promise<Buffer[]>;
    static loadDir<T extends string[]>(paths: T): Promise<Buffer[][]>;
    static loadGlob<T extends fastGlob.Pattern | fastGlob.Pattern[]>(globs: T, options?: fastGlob.Options): Promise<(Buffer | Buffer[])[]>;
    /**
     *  load file from url
     *
     * @example
     * ```js
     *  const files = Core.loadUrl(["https://example.com/file.text", "https://example.com/image.png"])
     *  // => Buffer[]
     *
     *  const file = Core.loadUrl("https://example.com/file.text")
     *  // => Buffer
     * ```
     */
    static loadUrl<T extends string | URL>(urls: T): Promise<Buffer>;
    static loadUrl<T extends string[] | URL[]>(urls: T): Promise<Buffer[]>;
    /**
     * Convert any of supported inputs to Buffer
     */
    static toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
    static toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
    /**
     * Convert any type of inputs to Readable
     */
    static toReadable<T extends InputFiles>(input: T): Promise<Readable>;
    static toReadable<T extends InputFiles[]>(input: T): Promise<Readable[]>;
    /**
     * Convert any type of inputs into base64 | base64url
     */
    static toBase64<T extends InputFiles>(input: T, encoding?: "base64" | "base64url"): Promise<string>;
    static toBase64<T extends InputFiles[]>(input: T, encoding?: "base64" | "base64url"): Promise<string[]>;
    /**
     * Save any type of inputs into file
     */
    static toFile(file: {
        path: string;
        input: InputFiles;
    }[]): Promise<void>;
}
//# sourceMappingURL=core.d.ts.map