var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile } from "node:fs/promises";
import path from "node:path";
import { any2buffer, array2buffer, isReadable, isReadableStream, isStream, readable2buffer, readablestream2buffer, stream2buffer, string2buffer, uint8array2buffer, } from "@ryn-bsd/from-buffer-to";
import fetch from "node-fetch";
import isBase64 from "is-base64";
import { isUrl } from "../helper/index.js";
import { isAnyArrayBuffer, isUint8Array } from "node:util/types";
export default class Core {
    constructor() { }
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
            const res = yield fetch(url);
            if (!res.ok)
                throw new Error(`${Core.name}: Can't fetch the text (${url})`);
            const arrayBuffer = yield res.arrayBuffer();
            return array2buffer(arrayBuffer);
        });
    }
    static toBuffer(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(input))
                return Promise.all(input.map((input) => Core.toBuffer(input)));
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
            else if (isReadable(input))
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
}
//# sourceMappingURL=core.js.map