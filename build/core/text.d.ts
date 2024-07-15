/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Readable } from "node:stream";
import type { BrotliCompressOptions, BrotliDecompressOptions, DeflateOptions, DeflateRawOptions, GunzipOptions, GzipOptions, InflateOptions, InflateRawOptions, TextCompressFn, TextCompressionMethods, TextCompressionOptions, TextCustomCallback, TextDecompressFn, TextDecompressionMethods, TextDecompressionOptions, TextSetCallback, UnzipOptions } from "../types/index.js";
import Core from "./core.js";
/**
 * At the end all files are just texts, so this class is applicable on all files
 */
export default class Text extends Core {
    private texts;
    /**
     * Create unsafe instance
     *
     * to create safe instance:
     * ```js
     *  const textFile = await Text.loadFile("text.txt")
     *
     *  // create safe new instance
     *  const text = Text.new(textFile)
     *  // => Text
     * ```
     */
    constructor(...texts: Buffer[]);
    /** get current length of texts */
    get length(): number;
    /**
     * get texts of this instance
     *
     * @example
     * ```js
     *  const buffer = await Text.loadFile("text.txt")
     *
     *  // not the same reference
     *  const texts = new Text(buffer).getTexts()
     *  // => 1
     * ```
     */
    getTexts(): Buffer[];
    /**
     * set texts
     *
     * @returns - new length
     *
     * @example
     * ```js
     *  const text = await Text.fromFile("text.txt")
     *
     *  // this method filter invalid texts after set
     *  const newLength = await text.setTexts(\* async *\(text, index) => {
     *    return index % 2 ? text : text.toString()
     *  })
     *  // => 0
     * ```
     */
    setTexts<T>(callback: TextSetCallback<T>): Promise<number>;
    /**
     *
     * @param texts - new texts (Buffer) to append the exists list
     * @returns - new length
     *
     * @example
     * ```js
     *  const text = new Text()
     *  const buffer1 = await Text.loadFile("text1.png")
     *  const buffer2 = await Text.loadFile("text2.png")
     *
     *  // filter invalid texts
     *  await text.append(buffer1, Buffer.alloc(0), buffer2)
     *  // => 2
     * ```
     */
    append(...texts: Buffer[]): Promise<number>;
    /**
     *
     * @param texts - extend texts from instance to an another
     * @returns - new length
     *
     * @example
     * ```js
     *  const buffer1 = await Text.loadFile("text1.txt")
     *  const buffer2 = await Text.loadFile("text2.txt")
     *  const text1 = new Text(buffer1, buffer2)
     *
     *  const text2 = new Text()
     *
     *  // don't apply any filters
     *  text2.extend(text1)
     *  // => 2
     * ```
     */
    extend(...texts: Text[]): number;
    /**
     *
     * @returns - clone current instance
     *
     * @example
     * ```js
     *  const text = new Text()
     *
     *  // not the same reference
     *  const clone = text.clone()
     *  // => Text
     * ```
     */
    clone(): Text;
    /**
     * Clean texts array, to free memory
     *
     * @example
     * ```js
     *  const text = await Text.fromFile("text.txt", "image.webp")
     *
     *  // Some operations
     *
     *  text.clean()
     *
     *  // Some operations
     *
     *  text.append(Buffer.alloc(1))
     * ```
     */
    clean(): void;
    /**
     * filter texts
     * @returns - new length
     *
     * @example
     * ```js
     *  const text = new Text(Buffer.alloc(1))
     *  await text.filter()
     *  // => 0
     * ```
     */
    filter(): Promise<number>;
    /**
     * @returns - key is the character code and value is the count
     */
    private charactersMap;
    /**
     * @returns - texts metadata
     *
     * @example
     * ```js
     *  const text1 = await Text.loadFile("text1.txt")
     *  const text2 = await Text.loadFile("text2.txt")
     *
     *  const text = new Text(text1, text2)
     *  const metadata = await text.metadata()
     *  // => { size: number; charactersMap: Map<number, number>; }[]
     * ```
     */
    metadata(): Promise<{
        size: number;
        charactersMap: Map<number, number>;
    }[]>;
    /**
     *
     * @param method - compress method
     * @param options - compress options
     * @returns - compressed data
     *
     * @example
     * ```js
     *  const textFile = await Text.loadFile("text.txt")
     *  const text = new Text(textFile)
     *  const buffers = await text.compressAsync("gzip")
     *  // => Buffer[]
     * ```
     */
    compressAsync<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>): Promise<Buffer[]>;
    /**
     *
     * @param method - decompress method
     * @param options - decompress options
     * @returns - decompressed data
     *
     * @example
     * ```js
     *  const textFile = await Text.loadFile("text.txt.gz")
     *  const text = new Text(textFile)
     *  const buffers = await text.decompressAsync("gunzip")
     *  // => Buffer[]
     * ```
     */
    decompressAsync<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>): Promise<Buffer[]>;
    /**
     *
     * @param method - compress method
     * @param options - compress options
     * @returns - compressed data
     *
     * @example
     * ```js
     *  const textFile = await Text.loadFile("text.txt")
     *  const text = new Text(textFile)
     *  const buffers = text.compressStream("gzip")
     *  // => Writable[]
     * ```
     */
    compressStream<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>): Promise<import("stream").Writable[]>;
    /**
     *
     * @param method - decompress method
     * @param options - decompress options
     * @returns - decompressed data
     *
     * @example
     * ```js
     *  const textFile = await Text.loadFile("text.txt.gz")
     *  const text = new Text(textFile)
     *  const buffers = text.decompressStream("gunzip")
     *  // => Writable[]
     * ```
     */
    decompressStream<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>): Promise<import("stream").Writable[]>;
    /**
     *
     * @param method - compress method
     * @param options - compress options
     * @returns - compressed data
     *
     * @example
     * ```js
     *  const textFile = await Text.loadFile("text.txt")
     *  const text = new Text(textFile)
     *  const buffers = text.compressSync("gzip")
     *  // => Buffer[]
     * ```
     */
    compressSync<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>): Buffer[];
    /**
     *
     * @param method - decompress method
     * @param options - decompress options
     * @returns - decompressed data
     *
     * @example
     * ```js
     *  const textFile = await Text.loadFile("text.txt.gz")
     *  const text = new Text(textFile)
     *  const buffers = text.decompressSync("gunzip")
     *  // => Buffer[]
     * ```
     */
    decompressSync<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>): Buffer[];
    /**
     * @returns - base on the callback return type
     *
     * @example
     * ```js
     *  const text1 = await Text.loadFile("text1.txt")
     *  const text2 = await Text.loadFile("text2.txt")
     *
     *  const text = new Text(text1, text2)
     *
     *  await text.custom(\* async *\(text, _index) => {
     *    return text.toString();
     *  })
     *  // => Buffer[]
     *
     *  await text.custom(\* async *\(_text, index) => {
     *    return index
     *  })
     *  // => number[]
     * ```
     */
    custom<T>(callback: TextCustomCallback<T>): Promise<Awaited<T>[]>;
    /**
     * compress core
     *
     * @param array - texts
     * @param method - compress method
     * @param gzipFn - gunzip function
     * @param deflateFn - deflate function
     * @param deflateRawFn - deflate raw function
     * @param brotliCompressFn - brotli compress function
     * @param options - compress option for each method
     * @returns - base on what your functions return
     */
    static compress<R, T extends Buffer[] | Readable[], M extends TextCompressionMethods>(array: T, method: M, gzipFn: TextCompressFn<R, T[number], M>, deflateFn: TextCompressFn<R, T[number], M>, deflateRawFn: TextCompressFn<R, T[number], M>, brotliCompressFn: TextCompressFn<R, T[number], M>, options?: TextCompressionOptions<M>): R[];
    /**
     * decompress core
     *
     * @param array - texts
     * @param method - decompress method
     * @param gunzipFn - gunzip function
     * @param inflateFn - inflate function
     * @param inflateRawFn - inflate raw function
     * @param brotliDecompressFn - brotli decompress function
     * @param unzipFn - unzip function
     * @param options - decompress option for each method
     * @returns - base on what your functions return
     */
    static decompress<R, T extends Buffer[] | Readable[], M extends TextDecompressionMethods>(array: T, method: M, gunzipFn: TextDecompressFn<R, T[number], M>, inflateFn: TextDecompressFn<R, T[number], M>, inflateRawFn: TextDecompressFn<R, T[number], M>, brotliDecompressFn: TextDecompressFn<R, T[number], M>, unzipFn: TextDecompressFn<R, T[number], M>, options?: TextDecompressionOptions<M>): R[];
    /**
     *
     * @returns - filter non text
     *
     * @example
     * ```js
     *  const text1 = await Text.loadFile("text1.txt")
     *  const text2 = await Text.loadFile("text2.txt")
     *
     *  const buffer = await Text.filter(text1, text2)
     *  // => Buffer[]
     * ```
     */
    static filter(...texts: Buffer[]): Promise<Buffer[]>;
    /**
     * @throws
     *
     * load texts from files
     * @returns - loaded files
     *
     * @example
     * ```js
     *  const text = await Text.fromFile("image.png")
     *  // => Text
     *
     *  const text = await Text.fromFile("image.png", "text.txt")
     *  // => Text
     *  const length = text.length
     *  // => 2
     *
     *  const text = await Text.fromFile("")
     *  // => Error (throw)
     * ```
     */
    static fromFile(...path: string[]): Promise<Text>;
    /**
     * @throws
     *
     * load texts from urls
     * @returns - loaded urls
     *
     * @example
     * ```js
     *  const text = await Text.fromUrl("http://example.com/text.txt")
     *  // => Text
     *
     *  const text = await Text.fromUrl("http://example.com/image.png", "http://example.com/text.txt")
     *  // => Text
     *  const length = text.length
     *  // => 2
     *
     *  const text = await Text.fromUrl("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Text>;
    /**
     * @throws
     *
     * @param texts - texts buffer
     * @returns - create new safe instance
     *
     * @example
     * ```js
     *  const text = await Text.new(Buffer.alloc(0))
     *  // => Error (throw)
     *
     *  const textFile = await Text.loadFile("text.txt")
     *
     *  // filter non text
     *  const text = await Text.new(textFile, Buffer.alloc(0))
     *  // => Text
     *  const length = text.length
     *  // => 1
     * ```
     */
    static new(texts: Buffer[]): Text;
    /**
     * check if an object is instance of Text or not
     * @returns - boolean
     *
     * @example
     * ```js
     *  const text = new Text()
     *  const isText = Text.isText(text)
     *  // => true
     *
     *  const object = new Object()
     *  const isNotText = Text.isText(object)
     *  // => false
     * ```
     */
    static isText(obj: unknown): obj is Text;
    static gzipAsync(text: Buffer, options?: GzipOptions): Promise<Buffer>;
    static deflateAsync(text: Buffer, options?: DeflateOptions): Promise<Buffer>;
    static deflateRawAsync(text: Buffer, options?: DeflateRawOptions): Promise<Buffer>;
    static brotliCompressAsync(text: Buffer, options?: BrotliCompressOptions): Promise<Buffer>;
    static gunzipAsync(text: Buffer, options?: GunzipOptions): Promise<Buffer>;
    static inflateAsync(text: Buffer, options?: InflateOptions): Promise<Buffer>;
    static inflateRawAsync(text: Buffer, options?: InflateRawOptions): Promise<Buffer>;
    static brotliDecompressAsync(text: Buffer, options?: BrotliDecompressOptions): Promise<Buffer>;
    static unzipAsync(text: Buffer, options?: UnzipOptions): Promise<Buffer>;
    static gzipStream(readable: Readable, options?: GzipOptions): import("stream").Writable;
    static deflateStream(readable: Readable, options?: DeflateOptions): import("stream").Writable;
    static deflateRawStream(readable: Readable, options?: DeflateRawOptions): import("stream").Writable;
    static brotliCompressStream(readable: Readable, options?: BrotliCompressOptions): import("stream").Writable;
    static gunzipStream(readable: Readable, options?: GunzipOptions): import("stream").Writable;
    static inflateStream(readable: Readable, options?: InflateOptions): import("stream").Writable;
    static inflateRawStream(readable: Readable, options?: InflateRawOptions): import("stream").Writable;
    static brotliDecompressStream(readable: Readable, options?: BrotliDecompressOptions): import("stream").Writable;
    static unzipStream(readable: Readable, options?: UnzipOptions): import("stream").Writable;
    static gzipSync(buffer: Buffer, options?: GzipOptions): Buffer;
    static deflateSync(buffer: Buffer, options?: DeflateOptions): Buffer;
    static deflateRawSync(buffer: Buffer, options?: DeflateRawOptions): Buffer;
    static brotliCompressSync(buffer: Buffer, options?: BrotliCompressOptions): Buffer;
    static gunzipSync(buffer: Buffer, options?: GunzipOptions): Buffer;
    static inflateSync(buffer: Buffer, options?: InflateOptions): Buffer;
    static inflateRawSync(buffer: Buffer, options?: InflateRawOptions): Buffer;
    static brotliDecompressSync(buffer: Buffer, options?: BrotliDecompressOptions): Buffer;
    static unzipSync(buffer: Buffer, options?: UnzipOptions): Buffer;
}
//# sourceMappingURL=text.d.ts.map