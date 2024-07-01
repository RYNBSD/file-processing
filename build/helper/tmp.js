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
import { writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { dir } from "tmp-promise";
import { Node as isFileNode } from "@ryn-bsd/is-file";
/**
 * Create a tmp dir store your files manipulate them and then clean.
 */
export default class TmpFile {
  constructor(...files) {
    this.paths = [];
    this.files = files;
  }
  createFn(file) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      const ext =
        (_b = (_a = yield isFileNode.type(file)) === null || _a === void 0 ? void 0 : _a.ext) !== null && _b !== void 0
          ? _b
          : "";
      if (ext.length === 0) throw new Error(`${TmpFile.name}: Unknown file when create`);
      const fileName = TmpFile.generateFileName(ext);
      const fullPath = path.join(this.tmp.path, fileName);
      yield writeFile(fullPath, file);
      this.paths.push(fullPath);
    });
  }
  create() {
    return __awaiter(this, void 0, void 0, function* () {
      yield Promise.all(this.files.map(this.createFn.bind(this)));
    });
  }
  init(options) {
    return __awaiter(this, void 0, void 0, function* () {
      this.tmp = yield dir(Object.assign({ unsafeCleanup: true }, options));
      yield this.create();
      return this;
    });
  }
  clean() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.tmp.cleanup();
      this.paths.splice(0, this.paths.length);
    });
  }
  static generateFileName(ext) {
    return `${randomUUID()}_${Date.now()}.${ext}`;
  }
}
//# sourceMappingURL=tmp.js.map
