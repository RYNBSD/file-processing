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
    constructor(...texts) {
        super();
        this.texts = texts;
    }
    getTexts() {
        return [...this.texts];
    }
    setTexts(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const texts = yield Promise.all(this.texts.map((text, index) => callback(text, index)));
            const filteredTexts = texts.filter((text) => Buffer.isBuffer(text));
            this.texts = filteredTexts;
        });
    }
    appendTexts(...texts) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredTexts = yield Text.filter(...texts);
            this.texts.push(...filteredTexts);
        });
    }
    extendTexts(...texts) {
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
            return this.texts.length;
        });
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            const texts = yield Text.filter(...this.texts);
            if (texts.length === 0)
                throw new TypeError(`${Text.name}: Files must be of type text`);
        });
    }
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.texts.map((text) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    size: text.length,
                });
            })));
        });
    }
    compress(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.texts.map((text) => {
                switch (method) {
                    case "gzip":
                        return Text.gzipAsync(text, options);
                    case "deflate":
                        return Text.deflateAsync(text, options);
                    case "deflate-raw":
                        return Text.deflateRawAsync(text, options);
                    case "brotli-compress":
                        return Text.brotliCompressAsync(text, options);
                    default:
                        throw new TypeError(`${Text.name}: Invalid compression method`);
                }
            }));
        });
    }
    decompress(method, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.texts.map((text) => {
                switch (method) {
                    case "gunzip":
                        return Text.gunzipAsync(text, options);
                    case "inflate":
                        return Text.inflateAsync(text, options);
                    case "inflate-raw":
                        return Text.inflateRawAsync(text, options);
                    case "brotli-decompress":
                        return Text.brotliDecompressAsync(text, options);
                    default:
                        throw new TypeError(`${Text.name}: Invalid decompression method`);
                }
            }));
        });
    }
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.texts.map(callback));
        });
    }
    static filter(...texts) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...texts).text();
        });
    }
    static fromFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return new Text(buffer);
        });
    }
    static fromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return new Text(buffer);
        });
    }
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
}
//# sourceMappingURL=text.js.map