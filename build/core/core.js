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
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { any2buffer, array2buffer, buffer2readable, isReadable, isReadableStream, isStream, readable2buffer, readablestream2buffer, stream2buffer, string2buffer, uint8array2buffer, url2buffer, } from "@ryn-bsd/from-buffer-to";
import isBase64 from "is-base64";
import puppeteer from "puppeteer";
import { isUrl } from "../helper/index.js";
export default class Core {
    constructor() { }
    // abstract stream(): Promise<void>;
    static stream(readable, writable) {
        return readable.pipe(writable);
    }
    static initBrowser(options) {
        return puppeteer.launch(options);
    }
    static loadFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(path))
                return Promise.all(path.map((p) => Core.loadFile(p)));
            return readFile(path);
        });
    }
    static loadUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(url))
                return Promise.all(url.map((u) => Core.loadUrl(u)));
            return url2buffer(url);
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
                if (isUrl(input))
                    return Core.loadUrl(input);
                else if (path.isAbsolute(input))
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
     */
    static toFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(file.map((f) => __awaiter(this, void 0, void 0, function* () {
                const buffer = yield Core.toBuffer(f.input);
                return writeFile(f.path, buffer);
            })));
        });
    }
}
//# sourceMappingURL=core.js.map