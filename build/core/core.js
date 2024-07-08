var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Readable } from "node:stream";
import { isAnyArrayBuffer, isUint8Array } from "node:util/types";
import fs from "node:fs";
import path from "node:path";
import { any2buffer, array2buffer, buffer2readable, isReadable, isReadableStream, isStream, readable2buffer, readablestream2buffer, stream2buffer, string2buffer, uint8array2buffer, url2buffer, } from "@ryn-bsd/from-buffer-to";
import isBase64 from "is-base64";
import fastGlob from "fast-glob";
import puppeteer from "puppeteer";
import { isUrl } from "../helper/index.js";
export default class Core {
    constructor() { }
    // abstract stream(): Promise<void>;
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
    static stream(readable, writable) {
        return readable.pipe(writable);
    }
    static initBrowser(options) {
        return puppeteer.launch(options);
    }
    static loadFile(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(paths))
                return Promise.all(paths.map((path) => Core.loadFile(path)));
            return fs.promises.readFile(paths);
        });
    }
    static loadDir(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(paths))
                return Promise.all(paths.map((path) => Core.loadDir(path)));
            const files = yield fs.promises.readdir(paths);
            return Core.loadFile(files.map((file) => path.join(paths, file)));
        });
    }
    /**
     * @example
     * ```js
     *  Core.loadGlob("/*.txt")
     *  // => (Buffer | Buffer[])[]
     *
     *  Core.loadGlob(["/*.txt", "/images"])
     *  // => (Buffer | Buffer[])[]
     * ```
     */
    static loadGlob(globs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const entries = yield fastGlob(globs, options);
            const cwd = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
            const results = yield Promise.all(entries.map((entry) => __awaiter(this, void 0, void 0, function* () {
                const fullPath = path.join(cwd, entry);
                const stat = yield fs.promises.stat(fullPath);
                if (stat.isFile())
                    return Core.loadFile(fullPath);
                else if (stat.isDirectory())
                    return Core.loadDir(fullPath);
                return null;
            })));
            return results.filter((result) => result !== null);
        });
    }
    static loadUrl(urls) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(urls))
                return Promise.all(urls.map((url) => Core.loadUrl(url)));
            return url2buffer(urls);
        });
    }
    static toBuffer(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(input))
                return Promise.all(input.map((i) => Core.toBuffer(i)));
            if (Buffer.isBuffer(input))
                return input;
            else if (isUrl(input))
                return Core.loadUrl(input);
            else if (isUint8Array(input))
                return uint8array2buffer(input);
            else if (isAnyArrayBuffer(input))
                return array2buffer(input);
            else if (isStream(input))
                return stream2buffer(input);
            else if (isReadableStream(input))
                return readablestream2buffer(input);
            else if (isReadable(input) && Readable.isReadable(input))
                return readable2buffer(input);
            else if (typeof input === "string") {
                const fileStat = yield fs.promises.stat(input);
                if (fileStat.isFile())
                    return Core.loadFile(input);
                else if (isBase64(input, { allowEmpty: false }))
                    return Buffer.from(input, "base64");
                return string2buffer(input, false);
            }
            return any2buffer(input);
        });
    }
    static toReadable(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(input))
                return Promise.all(input.map((i) => Core.toReadable(i)));
            if (isReadable(input) && Readable.isReadable(input))
                return input;
            const buffer = yield Core.toBuffer(input);
            return buffer2readable(buffer);
        });
    }
    static toBase64(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, encoding = "base64") {
            if (Array.isArray(input))
                return Promise.all(input.map((i) => Core.toBase64(i)));
            if (typeof input === "string" && isBase64(input))
                return input;
            const buffer = yield Core.toBuffer(input);
            return buffer.toString(encoding);
        });
    }
    /**
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
    static toFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(file.map((f) => __awaiter(this, void 0, void 0, function* () {
                const buffer = yield Core.toBuffer(f.input);
                return fs.promises.writeFile(f.path, buffer);
            })));
        });
    }
}
//# sourceMappingURL=core.js.map