import type { Readable } from "node:stream";
import type {
  BrotliCompressOptions,
  BrotliDecompressOptions,
  DeflateOptions,
  DeflateRawOptions,
  GunzipOptions,
  GzipOptions,
  InflateOptions,
  InflateRawOptions,
  TextCompressFn,
  TextCompressionMethods,
  TextCompressionOptions,
  TextCustomCallback,
  TextDecompressFn,
  TextDecompressionMethods,
  TextDecompressionOptions,
  TextSetCallback,
  UnzipOptions,
} from "../types/index.js";
import zlib from "node:zlib";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";

/**
 * At the end all files are just texts, so this class is applicable on all files
 */
export default class Text extends Core {
  private texts: Buffer[];

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
  constructor(...texts: Buffer[]) {
    super();
    this.texts = texts;
  }

  /** get current length of texts */
  get length() {
    return this.texts.length;
  }

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
  getTexts() {
    return [...this.texts];
  }

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
  async setTexts<T>(callback: TextSetCallback<T>) {
    const texts = await Promise.all(this.texts.map(async (text, index) => callback(text, index)));
    const filteredTexts = texts.filter((text) => Buffer.isBuffer(text) && text.length > 0) as Buffer[];
    this.texts = filteredTexts;
    return this.length;
  }

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
  override async append(...texts: Buffer[]) {
    // const filteredTexts = await Text.filter(...texts);
    const filteredTexts = texts.filter((text) => Buffer.isBuffer(text) && text.length > 0) as Buffer[];
    this.texts.push(...filteredTexts);
    return this.length;
  }

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
  override extend(...texts: Text[]) {
    texts.forEach((text) => {
      this.texts.push(...text.getTexts());
    });
    return this.length;
  }

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
  override clone() {
    return new Text(...this.texts);
  }

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
  override clean() {
    this.texts = [];
  }

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
  override async filter() {
    this.texts = await Text.filter(...this.texts);
    return this.length;
  }

  /**
   * @returns - key is the character code and value is the count
   */
  private charactersMap(text: Buffer) {
    const map = new Map<number, number>();
    const string = text.toString();

    for (const str of string) {
      const code = str.charCodeAt(0);
      map.has(code) ? map.set(code, map.get(code)! + 1) : map.set(code, 1);
    }

    return map;
  }

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
  override async metadata() {
    return this.custom((text) => {
      return {
        size: text.length,
        charactersMap: this.charactersMap(text),
      };
    });
  }

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
  async compressAsync<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>) {
    return Promise.all(
      Text.compress(
        this.texts,
        method,
        Text.gzipAsync,
        Text.deflateAsync,
        Text.deflateRawAsync,
        Text.brotliCompressAsync,
        options,
      ),
    );
  }

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
  async decompressAsync<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>) {
    return Promise.all(
      Text.decompress(
        this.texts,
        method,
        Text.gunzipAsync,
        Text.inflateAsync,
        Text.inflateRawAsync,
        Text.brotliDecompressAsync,
        Text.unzipAsync,
        options,
      ),
    );
  }

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
  async compressStream<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>) {
    const reads = await Core.toReadable(this.texts);
    return Text.compress(
      reads,
      method,
      Text.gzipStream,
      Text.deflateStream,
      Text.deflateRawStream,
      Text.brotliCompressStream,
      options,
    );
  }

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
  async decompressStream<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>) {
    const reads = await Core.toReadable(this.texts);
    return Text.decompress(
      reads,
      method,
      Text.gunzipStream,
      Text.inflateStream,
      Text.inflateRawStream,
      Text.brotliDecompressStream,
      Text.unzipStream,
      options,
    );
  }

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
  compressSync<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>) {
    return Text.compress(
      this.texts,
      method,
      Text.gzipSync,
      Text.deflateSync,
      Text.deflateRawSync,
      Text.brotliCompressSync,
      options,
    );
  }

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
  decompressSync<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>) {
    return Text.decompress(
      this.texts,
      method,
      Text.gunzipSync,
      Text.inflateSync,
      Text.inflateRawSync,
      Text.brotliDecompressSync,
      Text.unzipSync,
      options,
    );
  }

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
  async custom<T>(callback: TextCustomCallback<T>): Promise<Awaited<T>[]> {
    return Promise.all(this.texts.map(async (text, index) => callback(text, index)));
  }

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
  static compress<R, T extends Buffer[] | Readable[], M extends TextCompressionMethods>(
    array: T,
    method: M,
    gzipFn: TextCompressFn<R, T[number], M>,
    deflateFn: TextCompressFn<R, T[number], M>,
    deflateRawFn: TextCompressFn<R, T[number], M>,
    brotliCompressFn: TextCompressFn<R, T[number], M>,
    options?: TextCompressionOptions<M>,
  ): R[] {
    return array.map((text) => {
      switch (method) {
        case "gzip":
          return gzipFn(text, options);
        case "deflate":
          return deflateFn(text, options);
        case "deflate-raw":
          return deflateRawFn(text, options);
        case "brotli-compress":
          return brotliCompressFn(text, options);
        default:
          throw new TypeError(`${Text.name}: Invalid compression method (${method})`);
      }
    });
  }

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
  static decompress<R, T extends Buffer[] | Readable[], M extends TextDecompressionMethods>(
    array: T,
    method: M,
    gunzipFn: TextDecompressFn<R, T[number], M>,
    inflateFn: TextDecompressFn<R, T[number], M>,
    inflateRawFn: TextDecompressFn<R, T[number], M>,
    brotliDecompressFn: TextDecompressFn<R, T[number], M>,
    unzipFn: TextDecompressFn<R, T[number], M>,
    options?: TextDecompressionOptions<M>,
  ): R[] {
    return array.map((text) => {
      switch (method) {
        case "gunzip":
          return gunzipFn(text, options);
        case "inflate":
          return inflateFn(text, options);
        case "inflate-raw":
          return inflateRawFn(text, options);
        case "brotli-decompress":
          return brotliDecompressFn(text, options);
        case "unzip":
          return unzipFn(text, options);
        default:
          throw new TypeError(`${Text.name}: Invalid decompression method (${method})`);
      }
    });
  }

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
  static async filter(...texts: Buffer[]) {
    return new FilterFile(...texts).text();
  }

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
  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    return Text.new(buffer);
  }

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
  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    return Text.new(buffer);
  }

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
  static new(texts: Buffer[]) {
    const filtered = texts.filter((text) => text.length > 0);
    if (filtered.length === 0) throw new Error(`${Text.name}: Non valid text`);
    return new Text(...filtered);
  }

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
  static isText(obj: unknown): obj is Text {
    return obj instanceof Text;
  }

  // Async Compression //

  static async gzipAsync(text: Buffer, options: GzipOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.gzip(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async deflateAsync(text: Buffer, options: DeflateOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.deflate(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async deflateRawAsync(text: Buffer, options: DeflateRawOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.deflateRaw(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async brotliCompressAsync(text: Buffer, options: BrotliCompressOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.brotliCompress(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  // Async decompression //

  static async gunzipAsync(text: Buffer, options: GunzipOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.gunzip(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async inflateAsync(text: Buffer, options: InflateOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.inflate(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async inflateRawAsync(text: Buffer, options: InflateRawOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.inflateRaw(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async brotliDecompressAsync(text: Buffer, options: BrotliDecompressOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.brotliDecompress(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async unzipAsync(text: Buffer, options: UnzipOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.unzip(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  // Stream compression //

  static gzipStream(readable: Readable, options: GzipOptions = {}) {
    const gzip = zlib.createGzip(options);
    return Core.stream(readable, gzip);
  }

  static deflateStream(readable: Readable, options: DeflateOptions = {}) {
    const deflate = zlib.createDeflate(options);
    return Core.stream(readable, deflate);
  }

  static deflateRawStream(readable: Readable, options: DeflateRawOptions = {}) {
    const deflateRaw = zlib.createDeflateRaw(options);
    return Core.stream(readable, deflateRaw);
  }

  static brotliCompressStream(readable: Readable, options: BrotliCompressOptions = {}) {
    const brotliCompress = zlib.createBrotliCompress(options);
    return Core.stream(readable, brotliCompress);
  }

  // Stream decompression //

  static gunzipStream(readable: Readable, options: GunzipOptions = {}) {
    const gunzip = zlib.createGunzip(options);
    return Core.stream(readable, gunzip);
  }

  static inflateStream(readable: Readable, options: InflateOptions = {}) {
    const inflate = zlib.createInflate(options);
    return Core.stream(readable, inflate);
  }

  static inflateRawStream(readable: Readable, options: InflateRawOptions = {}) {
    const inflateRaw = zlib.createInflateRaw(options);
    return Core.stream(readable, inflateRaw);
  }

  static brotliDecompressStream(readable: Readable, options: BrotliDecompressOptions = {}) {
    const brotliDecompress = zlib.createBrotliDecompress(options);
    return Core.stream(readable, brotliDecompress);
  }

  static unzipStream(readable: Readable, options: UnzipOptions = {}) {
    const unzip = zlib.createUnzip(options);
    return Core.stream(readable, unzip);
  }

  // Sync compression //

  static gzipSync(buffer: Buffer, options: GzipOptions = {}) {
    return zlib.gzipSync(buffer, options);
  }

  static deflateSync(buffer: Buffer, options: DeflateOptions = {}) {
    return zlib.deflateSync(buffer, options);
  }

  static deflateRawSync(buffer: Buffer, options: DeflateRawOptions = {}) {
    return zlib.deflateRawSync(buffer, options);
  }

  static brotliCompressSync(buffer: Buffer, options: BrotliCompressOptions = {}) {
    return zlib.brotliCompressSync(buffer, options);
  }

  // Sync decompression //

  static gunzipSync(buffer: Buffer, options: GunzipOptions = {}) {
    return zlib.gunzipSync(buffer, options);
  }

  static inflateSync(buffer: Buffer, options: InflateOptions = {}) {
    return zlib.inflateSync(buffer, options);
  }

  static inflateRawSync(buffer: Buffer, options: InflateRawOptions = {}) {
    return zlib.inflateRawSync(buffer, options);
  }

  static brotliDecompressSync(buffer: Buffer, options: BrotliDecompressOptions = {}) {
    return zlib.brotliDecompressSync(buffer, options);
  }

  static unzipSync(buffer: Buffer, options: UnzipOptions = {}) {
    return zlib.unzipSync(buffer, options);
  }
}
