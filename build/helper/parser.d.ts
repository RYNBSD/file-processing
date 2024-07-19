/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { Readable } from "node:stream";
import { InputFiles } from "../types/index.js";
/**
 * @param input - any type of supported inputs
 *
 * @example
 * ```js
 *  toBuffer("cnluYnNk")
 *  toBuffer("/file.text")
 *  toBuffer("https://example.com/file.text")
 * ```
 */
export declare function toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
export declare function toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
/**
 * Convert any type of inputs to Readable
 *
 * @example
 * ```js
 *  toReadable("cnluYnNk")
 *  toReadable("/file.text")
 *  toReadable("https://example.com/file.text")
 * ```
 */
export declare function toReadable<T extends InputFiles>(input: T): Promise<Readable>;
export declare function toReadable<T extends InputFiles[]>(input: T): Promise<Readable[]>;
/**
 * Convert any type of inputs into base64 | base64url
 *
 * @example
 * ```js
 *  toBase64("cnluYnNk")
 *  toBase64("/file.text")
 *  toBase64("https://example.com/file.text")
 * ```
 */
export declare function toBase64<T extends InputFiles>(input: T, encoding?: "base64" | "base64url"): Promise<string>;
export declare function toBase64<T extends InputFiles[]>(input: T, encoding?: "base64" | "base64url"): Promise<string[]>;
/**
 * Save any type of inputs into file
 *
 * @example
 * ```js
 *  toFile(
 *    [
 *      {
 *        path: "where-to-store.txt",
 *        input: Buffer.alloc(1)
 *      }
 *    ]
 *  )
 * ```
 */
export declare function toFile(file: {
    path: string;
    input: InputFiles;
}[]): Promise<void>;
//# sourceMappingURL=parser.d.ts.map