var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { TmpFile } from "../../helper/index.js";
import Core from "../core.js";
export default class AV extends Core {
    constructor(...avs) {
        super();
        this.avs = avs;
    }
    get length() {
        return this.avs.length;
    }
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((av) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    AV.newFfmpeg(av).ffprobe((err, metadata) => {
                        if (err)
                            return reject(err);
                        resolve(metadata);
                    });
                });
            })));
            yield tmpFile.clean();
            return result;
        });
    }
    convert(format, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((p) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                    AV.newFfmpeg(p, options)
                        .on("end", () => {
                        readFile(output).then(resolve).catch(reject);
                    })
                        .on("error", reject)
                        .output(output, { end: true })
                        .run();
                });
            })));
            yield tmpFile.clean();
            return result;
        });
    }
    // async stream() {
    //   const reads = await Core.toReadable(this.avs);
    //   return reads.map((av) => AV.newFfmpeg(av).pipe());
    // }
    /**
     * In case of invalid method, buffer will be default
     */
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((path, index) => __awaiter(this, void 0, void 0, function* () { return callback(AV.newFfmpeg(path), index); })));
            yield tmpFile.clean();
            return result;
        });
    }
    /**
     * new Instance of ffmpeg
     */
    static newFfmpeg(av, options) {
        return ffmpeg(options).clone().setFfmpegPath(ffmpegPath).setFfprobePath(ffprobePath).input(av);
    }
}
//# sourceMappingURL=av.js.map