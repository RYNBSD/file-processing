var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "node:fs";
import path from "node:path";
import fastGlob from "fast-glob";
import { url2buffer } from "@ryn-bsd/from-buffer-to";
export function loadFile(paths) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(paths))
            return Promise.all(paths.map((path) => loadFile(path)));
        return fs.promises.readFile(paths);
    });
}
export function loadDir(paths) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(paths))
            return Promise.all(paths.map((path) => loadDir(path)));
        const files = yield fs.promises.readdir(paths);
        return loadFile(files.map((file) => path.join(paths, file)));
    });
}
/**
 * @example
 * ```js
 *  loadGlob("/*.txt")
 *  // => (Buffer | Buffer[])[]
 *
 *  loadGlob(["/*.txt", "/images"])
 *  // => (Buffer | Buffer[])[]
 * ```
 */
export function loadGlob(globs, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const cwd = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
        const entries = yield fastGlob(globs, options);
        const results = yield Promise.all(entries.map((entry) => __awaiter(this, void 0, void 0, function* () {
            const fullPath = path.join(cwd, entry);
            const stat = yield fs.promises.stat(fullPath);
            if (stat.isFile())
                return loadFile(fullPath);
            else if (stat.isDirectory())
                return loadDir(fullPath);
            return null;
        })));
        return results.filter((result) => result !== null);
    });
}
export function loadUrl(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(urls))
            return Promise.all(urls.map((url) => loadUrl(url)));
        return url2buffer(urls);
    });
}
//# sourceMappingURL=loader.js.map