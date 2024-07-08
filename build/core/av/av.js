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
            const result = yield Promise.all(tmpFile.paths.map((av) => new Promise((resolve, reject) => {
                AV.newFfmpeg(av).ffprobe((err, metadata) => {
                    if (err)
                        return reject(err);
                    resolve(metadata);
                });
            })));
            yield tmpFile.clean();
            return result;
        });
    }
    convert(format, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((p) => {
                return new Promise((resolve, reject) => {
                    const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                    AV.newFfmpeg(p, options)
                        .on("end", () => {
                        Core.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .output(output, { end: true })
                        .run();
                });
            }));
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
            const result = yield Promise.all(tmpFile.paths.map((path, index) => __awaiter(this, void 0, void 0, function* () { return callback(AV.newFfmpeg(path), tmpFile, index); })));
            yield tmpFile.clean();
            return result;
        });
    }
    static generateTimemarks(metadata_1) {
        return __awaiter(this, arguments, void 0, function* (metadata, interval = 1) {
            var _a;
            if (Array.isArray(metadata))
                return Promise.all(metadata.map((mt) => AV.generateTimemarks(mt, interval)));
            const timemarks = [];
            const duration = (_a = metadata.format.duration) !== null && _a !== void 0 ? _a : 0;
            for (let i = 0; i < duration; i += interval)
                timemarks.push(i);
            return timemarks;
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