var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
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
  constructor(...texts) {
    super();
    this.texts = texts;
  }
  get length() {
    return this.texts.length;
  }
  getTexts() {
    return [...this.texts];
  }
  setTexts(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const texts = yield Promise.all(
        this.texts.map((text, index) =>
          __awaiter(this, void 0, void 0, function* () {
            return callback(text, index);
          }),
        ),
      );
      const filteredTexts = texts.filter((text) => Buffer.isBuffer(text) && text.length > 0);
      this.texts = filteredTexts;
      return this.length;
    });
  }
  append(...texts) {
    return __awaiter(this, void 0, void 0, function* () {
      // const filteredTexts = await Text.filter(...texts);
      this.texts.push(...texts);
    });
  }
  extend(...texts) {
    texts.forEach((text) => {
      this.texts.push(...text.getTexts());
    });
  }
  clone() {
    return new Text(...this.texts);
  }
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
  metadata() {
    return __awaiter(this, void 0, void 0, function* () {
      return Promise.all(
        this.texts.map((text) =>
          __awaiter(this, void 0, void 0, function* () {
            return {
              size: text.length,
              charactersMap: this.charactersMap(text),
            };
          }),
        ),
      );
    });
  }
  compressAsync(method, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
  }
  decompressAsync(method, options) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
  }
  compressStream(method, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const reads = yield Core.toReadable(this.texts);
      return Text.compress(
        reads,
        method,
        Text.gzipStream,
        Text.deflateStream,
        Text.deflateRawStream,
        Text.brotliCompressStream,
        options,
      );
    });
  }
  decompressStream(method, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const reads = yield Core.toReadable(this.texts);
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
    });
  }
  compressSync(method, options) {
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
  decompressSync(method, options) {
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
  custom(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      return Promise.all(
        this.texts.map((text, index) =>
          __awaiter(this, void 0, void 0, function* () {
            return callback(text, index);
          }),
        ),
      );
    });
  }
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
  static filter(...texts) {
    return __awaiter(this, void 0, void 0, function* () {
      return new FilterFile(...texts).text();
    });
  }
  static fromFile(...path) {
    return __awaiter(this, void 0, void 0, function* () {
      const buffer = yield Core.loadFile(path);
      return new Text(...buffer);
    });
  }
  static fromUrl(...url) {
    return __awaiter(this, void 0, void 0, function* () {
      const buffer = yield Core.loadUrl(url);
      return new Text(...buffer);
    });
  }
  // Async Compression //
  static gzipAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.gzip(text, options, (err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
      });
    });
  }
  static deflateAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.deflate(text, options, (err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
      });
    });
  }
  static deflateRawAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.deflateRaw(text, options, (err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
      });
    });
  }
  static brotliCompressAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.brotliCompress(text, options, (err, buf) => {
          if (err) return reject(err);
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
          if (err) return reject(err);
          resolve(buf);
        });
      });
    });
  }
  static inflateAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.inflate(text, options, (err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
      });
    });
  }
  static inflateRawAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.inflateRaw(text, options, (err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
      });
    });
  }
  static brotliDecompressAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.brotliDecompress(text, options, (err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
      });
    });
  }
  static unzipAsync(text_1) {
    return __awaiter(this, arguments, void 0, function* (text, options = {}) {
      return new Promise((resolve, reject) => {
        zlib.unzip(text, options, (err, buf) => {
          if (err) return reject(err);
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
