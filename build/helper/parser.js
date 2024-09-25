var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isAnyArrayBuffer, isUint8Array } from "node:util/types";
import { Readable } from "node:stream";
import fs from "node:fs";
import { isUrl } from "./fn.js";
import { any2buffer, array2buffer, buffer2readable, isReadable, isReadableStream, isStream, readable2buffer, readablestream2buffer, stream2buffer, string2buffer, uint8array2buffer, } from "@ryn-bsd/from-buffer-to";
import isBase64 from "is-base64";
import { loadFile, loadUrl } from "./loader.js";
export function toBuffer(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(input))
            return Promise.all(input.map((i) => toBuffer(i)));
        if (Buffer.isBuffer(input))
            return input;
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
            if (isBase64(input, { allowMime: true, mimeRequired: true }))
                return Buffer.from(input, "base64url");
            if (isBase64(input, { allowMime: false }))
                return Buffer.from(input, "base64");
            const fileStat = yield fs.promises.stat(input);
            if (fileStat.isFile())
                return loadFile(input);
            return string2buffer(input, false);
        }
        else if (isUrl(input))
            return loadUrl(input);
        return any2buffer(input);
    });
}
export function toReadable(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(input))
            return Promise.all(input.map((i) => toReadable(i)));
        if (isReadable(input) && Readable.isReadable(input))
            return input;
        const buffer = yield toBuffer(input);
        return buffer2readable(buffer);
    });
}
export function toBase64(input_1) {
    return __awaiter(this, arguments, void 0, function* (input, encoding = "base64") {
        if (Array.isArray(input))
            return Promise.all(input.map((i) => toBase64(i)));
        if (typeof input === "string" && isBase64(input))
            return input;
        const buffer = yield toBuffer(input);
        return buffer.toString(encoding);
    });
}
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
export function toFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(file.map((f) => __awaiter(this, void 0, void 0, function* () {
            const buffer = yield toBuffer(f.input);
            return fs.promises.writeFile(f.path, buffer);
        })));
    });
}
//# sourceMappingURL=parser.js.map