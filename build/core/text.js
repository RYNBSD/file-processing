var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import zlib from "node:zlib";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";
/**
 * At the end all files are just texts, so this class is applicable on all files
 */
export default class Text extends Core {
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
    constructor(...texts) {
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
     *  // => Buffer[]
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
     *  // this method filter invalid texts before set
     *  const newLength = await text.setTexts(\* async *\(text, index) => {
     *    return index % 2 ? text : text.toString()
     *  })
     *  // => 0
     * ```
     */
    setTexts(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const texts = yield Promise.all(this.texts.map((text, index) => __awaiter(this, void 0, void 0, function* () { return callback(text, index); })));
            const filteredTexts = texts.filter((text) => Buffer.isBuffer(text) && text.length > 0);
            this.texts = filteredTexts;
            return this.length;
        });
    }
    /**
     *
     * @param texts - new texts (Buffer) to append the exists list
     * @returns - new length
     *
     * @example
     * ```js
     *  const text = new Text()
     *  const buffer1 = await Text.loadFile("text1.txt")
     *  const buffer2 = await Text.loadFile("text2.txt")
     *
     *  // filter invalid texts
     *  await text.append(buffer1, Buffer.alloc(0), buffer2)
     *  // => 2
     * ```
     */
    append(...texts) {
        return __awaiter(this, void 0, void 0, function* () {
            // const filteredTexts = await Text.filter(...texts);
            const filteredTexts = texts.filter((text) => Buffer.isBuffer(text) && text.length > 0);
            this.texts.push(...filteredTexts);
            return this.length;
        });
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
    extend(...texts) {
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
    clone() {
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
    clean() {
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
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.texts = yield Text.filter(...this.texts);
            return this.length;
        });
    }
    /**
     * @returns - key is the character code and value is the count
     */
    charactersMap(text) {
        const map = new Map();
        const string = text.toString();
        for (const str of string) {
            const code = str.charCodeAt(0);
            map.has(code) ? map.set(code, map.get(code) + 1) : map.set(code, 1);
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
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((text) => {
                return {
                    size: text.length,
                    charactersMap: this.charactersMap(text),
                };
            });
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
    compressAsync(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(Text.compress(this.texts, method, Text.gzipAsync, Text.deflateAsync, Text.deflateRawAsync, Text.brotliCompressAsync, options));
        });
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
    decompressAsync(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(Text.decompress(this.texts, method, Text.gunzipAsync, Text.inflateAsync, Text.inflateRawAsync, Text.brotliDecompressAsync, Text.unzipAsync, options));
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
     *  const buffers = text.compressStream("gzip")
     *  // => Writable[]
     * ```
     */
    compressStream(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield Core.toReadable(this.texts);
            return Text.compress(reads, method, Text.gzipStream, Text.deflateStream, Text.deflateRawStream, Text.brotliCompressStream, options);
        });
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
    decompressStream(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield Core.toReadable(this.texts);
            return Text.decompress(reads, method, Text.gunzipStream, Text.inflateStream, Text.inflateRawStream, Text.brotliDecompressStream, Text.unzipStream, options);
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
     *  const buffers = text.compressSync("gzip")
     *  // => Buffer[]
     * ```
     */
    compressSync(method, options) {
        return Text.compress(this.texts, method, Text.gzipSync, Text.deflateSync, Text.deflateRawSync, Text.brotliCompressSync, options);
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
    decompressSync(method, options) {
        return Text.decompress(this.texts, method, Text.gunzipSync, Text.inflateSync, Text.inflateRawSync, Text.brotliDecompressSync, Text.unzipSync, options);
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
     *  // => string[]
     *
     *  await text.custom(\* async *\(_text, index) => {
     *    return index
     *  })
     *  // => number[]
     * ```
     */
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.texts.map((text, index) => __awaiter(this, void 0, void 0, function* () { return callback(text, index); })));
        });
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
    static compress(array, method, gzipFn, deflateFn, deflateRawFn, brotliCompressFn, options) {
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
    static decompress(array, method, gunzipFn, inflateFn, inflateRawFn, brotliDecompressFn, unzipFn, options) {
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
    static filter(...texts) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...texts).text();
        });
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
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return Text.new(buffer);
        });
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
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return Text.new(buffer);
        });
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
    static new(texts) {
        const filtered = texts.filter((text) => text.length > 0);
        if (filtered.length === 0)
            throw new Error(`${Text.name}: Non valid text`);
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
    static isText(obj) {
        return obj instanceof Text;
    }
    // Async Compression //
    static gzipAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.gzip(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    static deflateAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.deflate(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    static deflateRawAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.deflateRaw(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    static brotliCompressAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.brotliCompress(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    // Async decompression //
    static gunzipAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.gunzip(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    static inflateAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.inflate(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    static inflateRawAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.inflateRaw(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    static brotliDecompressAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.brotliDecompress(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    static unzipAsync(text_1) {
        return __awaiter(this, arguments, void 0, function* (text, options = {}) {
            return new Promise((resolve, reject) => {
                zlib.unzip(text, options, (err, buf) => {
                    if (err)
                        return reject(err);
                    resolve(buf);
                });
            });
        });
    }
    // Stream compression //
    static gzipStream(readable, options = {}) {
        const gzip = zlib.createGzip(options);
        return Core.stream(readable, gzip);
    }
    static deflateStream(readable, options = {}) {
        const deflate = zlib.createDeflate(options);
        return Core.stream(readable, deflate);
    }
    static deflateRawStream(readable, options = {}) {
        const deflateRaw = zlib.createDeflateRaw(options);
        return Core.stream(readable, deflateRaw);
    }
    static brotliCompressStream(readable, options = {}) {
        const brotliCompress = zlib.createBrotliCompress(options);
        return Core.stream(readable, brotliCompress);
    }
    // Stream decompression //
    static gunzipStream(readable, options = {}) {
        const gunzip = zlib.createGunzip(options);
        return Core.stream(readable, gunzip);
    }
    static inflateStream(readable, options = {}) {
        const inflate = zlib.createInflate(options);
        return Core.stream(readable, inflate);
    }
    static inflateRawStream(readable, options = {}) {
        const inflateRaw = zlib.createInflateRaw(options);
        return Core.stream(readable, inflateRaw);
    }
    static brotliDecompressStream(readable, options = {}) {
        const brotliDecompress = zlib.createBrotliDecompress(options);
        return Core.stream(readable, brotliDecompress);
    }
    static unzipStream(readable, options = {}) {
        const unzip = zlib.createUnzip(options);
        return Core.stream(readable, unzip);
    }
    // Sync compression //
    static gzipSync(buffer, options = {}) {
        return zlib.gzipSync(buffer, options);
    }
    static deflateSync(buffer, options = {}) {
        return zlib.deflateSync(buffer, options);
    }
    static deflateRawSync(buffer, options = {}) {
        return zlib.deflateRawSync(buffer, options);
    }
    static brotliCompressSync(buffer, options = {}) {
        return zlib.brotliCompressSync(buffer, options);
    }
    // Sync decompression //
    static gunzipSync(buffer, options = {}) {
        return zlib.gunzipSync(buffer, options);
    }
    static inflateSync(buffer, options = {}) {
        return zlib.inflateSync(buffer, options);
    }
    static inflateRawSync(buffer, options = {}) {
        return zlib.inflateRawSync(buffer, options);
    }
    static brotliDecompressSync(buffer, options = {}) {
        return zlib.brotliDecompressSync(buffer, options);
    }
    static unzipSync(buffer, options = {}) {
        return zlib.unzipSync(buffer, options);
    }
}
//# sourceMappingURL=text.js.map