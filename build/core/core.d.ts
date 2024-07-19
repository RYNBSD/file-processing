/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { InputFiles } from "../types/index.js";
import { Readable, type Writable } from "node:stream";
import fastGlob from "fast-glob";
import puppeteer from "puppeteer";
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
    static stream(readable: Readable, writable: Writable): Writable;
    static initBrowser(options?: puppeteer.PuppeteerLaunchOptions): Promise<puppeteer.Browser>;
    /**
     * @deprecated use loader.loadFile() from helper
     *
     * @param paths - file/files path
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
     * @deprecated use loader.loadDir() from helper
     *
     * @param paths - directory/directories path
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
    /**
     * @deprecated  use loader.loadGlob() from helper
     *
     * @example
     * ```js
     *  Core.loadGlob("/*.txt")
     *  // => (Buffer | Buffer[])[]
     *
     *  Core.loadGlob(["/*.txt", "/images"])
     *  // => (Buffer | Buffer[])[]
     * ```
     */
    static loadGlob<T extends fastGlob.Pattern | fastGlob.Pattern[]>(globs: T, options?: fastGlob.Options): Promise<(Buffer | Buffer[])[]>;
    /**
     * @deprecated  use loader.loadUrl() from helper
     *
     *  @param urls - file/files url
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
     * @deprecated use parser.toBuffer() from helper
     *
     * @param input - any type of supported inputs
     *
     * @example
     * ```js
     *  Core.toBuffer("cnluYnNk")
     *  Core.toBuffer("/file.text")
     *  Core.toBuffer("https://example.com/file.text")
     * ```
     */
    static toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
    static toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
    /**
     * @deprecated use parser.toReadable() from helper
     *
     * Convert any type of inputs to Readable
     *
     * @example
     * ```js
     *  Core.toReadable("cnluYnNk")
     *  Core.toReadable("/file.text")
     *  Core.toReadable("https://example.com/file.text")
     * ```
     */
    static toReadable<T extends InputFiles>(input: T): Promise<Readable>;
    static toReadable<T extends InputFiles[]>(input: T): Promise<Readable[]>;
    /**
     * @deprecated use parser.toBase64() from helper
     *
     * Convert any type of inputs into base64 | base64url
     *
     * @example
     * ```js
     *  Core.toBase64("cnluYnNk")
     *  Core.toBase64("/file.text")
     *  Core.toBase64("https://example.com/file.text")
     * ```
     */
    static toBase64<T extends InputFiles>(input: T, encoding?: "base64" | "base64url"): Promise<string>;
    static toBase64<T extends InputFiles[]>(input: T, encoding?: "base64" | "base64url"): Promise<string[]>;
    /**
     * @deprecated use parser.toFile() from helper
     *
     * Save any type of inputs into file
     *
     * @example
     * ```js
     *  Core.toFile(
     *    [
     *      {
     *        path: "where-to-store.txt",
     *        input: Buffer.alloc(1)
     *      }
     *    ]
     *  )
     * ```
     */
    static toFile(file: {
        path: string;
        input: InputFiles;
    }[]): Promise<void>;
}
//# sourceMappingURL=core.d.ts.map