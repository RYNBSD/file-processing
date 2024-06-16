/// <reference types="node" resolution-mode="require"/>
import type { BrotliCompressOptions, BrotliDecompressOptions, DeflateOptions, DeflateRawOptions, GunzipOptions, GzipOptions, InflateOptions, InflateRawOptions, TextCompressionMethods, TextCompressionOptions, TextCustomCallback, TextDecompressionMethods, TextDecompressionOptions, TextSetCallback } from "../types/index.js";
import Core from "./core.js";
/**
 * At the end all files are just texts, so this class is applicable on all files
 */
export default class Text extends Core {
    private texts;
    constructor(...texts: Buffer[]);
    getTexts(): Buffer[];
    setTexts<T>(callback: TextSetCallback<T>): Promise<void>;
    appendTexts(...texts: Buffer[]): Promise<void>;
    extendTexts(...texts: Text[]): void;
    clone(): Text;
    filter(): Promise<number>;
    check(): Promise<void>;
    metadata(): Promise<{
        size: number;
    }[]>;
    compress<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>): Promise<Buffer[]>;
    decompress<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>): Promise<Buffer[]>;
    custom<T>(callback: TextCustomCallback<T>): Promise<Awaited<T>[]>;
    static filter(...texts: Buffer[]): Promise<Buffer[]>;
    static fromFile(path: string): Promise<Text>;
    static fromUrl<T extends string | URL>(url: T): Promise<Text>;
    static gzipAsync(text: Buffer, options?: GzipOptions): Promise<Buffer>;
    static deflateAsync(text: Buffer, options?: DeflateOptions): Promise<Buffer>;
    static deflateRawAsync(text: Buffer, options?: DeflateRawOptions): Promise<Buffer>;
    static brotliCompressAsync(text: Buffer, options?: BrotliCompressOptions): Promise<Buffer>;
    static gunzipAsync(text: Buffer, options?: GunzipOptions): Promise<Buffer>;
    static inflateAsync(text: Buffer, options?: InflateOptions): Promise<Buffer>;
    static inflateRawAsync(text: Buffer, options?: InflateRawOptions): Promise<Buffer>;
    static brotliDecompressAsync(text: Buffer, options?: BrotliDecompressOptions): Promise<Buffer>;
}
//# sourceMappingURL=text.d.ts.map