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
import { isReadable, isStream, stream2buffer } from "@ryn-bsd/from-buffer-to";
import { isArrayBuffer, isSharedArrayBuffer, isUint8Array, } from "node:util/types";
/**
 * @deprecated
 * Call:
 * ```js
 *  Core.toBuffer();
 * ```
 */
export function input2buffer(input) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Buffer.isBuffer(input))
            return input;
        else if (typeof input === "string")
            return readFile(input);
        else if (isReadable(input) || isStream(input))
            return stream2buffer(input);
        else if (isUint8Array(input) ||
            isArrayBuffer(input) ||
            isSharedArrayBuffer(input))
            return Buffer.from(input);
        return null;
    });
}
export function isArrayOfBuffer(array) {
    if (!Array.isArray(array))
        return false;
    for (const arr of array)
        if (!Buffer.isBuffer(arr))
            return false;
    return true;
}
export function isArrayOfString(array) {
    if (!Array.isArray(array))
        return false;
    for (const arr of array)
        if (typeof arr !== "string")
            return false;
    return true;
}
export function isUrl(value) {
    if (typeof value !== "string")
        return false;
    try {
        new URL(value);
        return true;
    }
    catch (error) {
        return false;
    }
}
//# sourceMappingURL=fn.js.map