/// <reference types="node" resolution-mode="require"/>
import fastGlob from "fast-glob";
/**
 *  @param paths - file/files path
 *
 * @example
 * ```js
 *  const files = loadFile(["/file.txt", "/image.png"])
 *  // => Buffer[]
 *
 *  const file = loadFile("/file.txt")
 *  // => Buffer
 * ```
 */
export declare function loadFile<T extends string>(paths: T): Promise<Buffer>;
export declare function loadFile<T extends string[]>(paths: T): Promise<Buffer[]>;
/**
 *  @param paths - directory/directories path
 *
 * @example
 * ```js
 *  const files = loadDir(["/dir1", "/dir2"])
 *  // => Buffer[][]
 *
 *  const file = loadDir("/dir")
 *  // => Buffer[]
 * ```
 */
export declare function loadDir<T extends string>(paths: T): Promise<Buffer[]>;
export declare function loadDir<T extends string[]>(paths: T): Promise<Buffer[][]>;
/**
 * @example
 * ```js
 *  loadGlob("/*.txt")
 *  // => (Buffer | Buffer[])[]
 *
 *  loadGlob(["/*.txt", "/images"])
 *  // => (Buffer | Buffer[])[]
 * ```
 */
export declare function loadGlob<T extends fastGlob.Pattern | fastGlob.Pattern[]>(globs: T, options?: fastGlob.Options): Promise<(Buffer | Buffer[])[]>;
/**
 *  @param urls - file/files url
 *
 * @example
 * ```js
 *  const files = loadUrl(["https://example.com/file.text", "https://example.com/image.png"])
 *  // => Buffer[]
 *
 *  const file = loadUrl("https://example.com/file.text")
 *  // => Buffer
 * ```
 */
export declare function loadUrl<T extends string | URL>(urls: T): Promise<Buffer>;
export declare function loadUrl<T extends string[] | URL[]>(urls: T): Promise<Buffer[]>;
//# sourceMappingURL=loader.d.ts.map