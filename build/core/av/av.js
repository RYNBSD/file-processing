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
import { FilterFile, TmpFile } from "../../helper/index.js";
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
            return this.custom((command) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    command.ffprobe((err, metadata) => {
                        if (err)
                            return reject(err);
                        resolve(metadata);
                    });
                });
            }));
        });
    }
    convert(format) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command, tmpFile) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                    command
                        .on("end", () => {
                        Core.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .output(output)
                        .run();
                });
            }));
        });
    }
    spilt(duration_1) {
        return __awaiter(this, arguments, void 0, function* (duration, start = 0) {
            return this.custom((command, tmpFile, index, avPath) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const metadata = yield new Promise((resolve, reject) => {
                    command.ffprobe((error, metadata) => {
                        if (error)
                            return reject(error);
                        resolve(metadata);
                    });
                });
                const avDuration = (_a = metadata.format.duration) !== null && _a !== void 0 ? _a : 0;
                if (avDuration === 0)
                    throw new Error(`${AV.name}: Empty av duration`);
                const format = (_b = (yield FilterFile.extension(this.avs[index]))) !== null && _b !== void 0 ? _b : "";
                if (format.length === 0)
                    throw new Error(`${AV.name}: Unknown av format`);
                // TODO: fix
                const splitMap = [];
                for (let i = start; i < avDuration; i += duration) {
                    const validDuration = Math.min(duration, avDuration - i);
                    splitMap.push({ start: i, duration: validDuration });
                }
                return Promise.all(splitMap.map(({ start, duration }, index) => {
                    return new Promise((resolve, reject) => {
                        const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                        AV.newFfmpeg(avPath)
                            .setStartTime(start)
                            .setDuration(duration)
                            .on("end", () => {
                            Core.loadFile(output).then(resolve, reject);
                        })
                            .on("error", (err) => {
                            console.log(index);
                            resolve(err);
                        })
                            .output(output)
                            .run();
                    });
                }));
                // const chunks: Buffer[] = [];
                // let i = start;
                // while (i < avDuration) {
                //   const validDuration = Math.min(duration, avDuration - start);
                //   const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));
                //   const chunk = await new Promise<Buffer>((resolve, reject) => {
                //     AV.newFfmpeg(avPath)
                //       .setStartTime(i)
                //       .setDuration(validDuration)
                //       .on("start", (command) => {
                //         console.log(command);
                //       })
                //       .on("end", () => {
                //         Core.loadFile(output).then(resolve, reject);
                //       })
                //       .on("error", reject)
                //       .output(output)
                //       .run();
                //   });
                //   chunks.push(chunk);
                //   i += validDuration;
                // }
                // return chunks;
            }));
        });
    }
    /**
     * In case of invalid method, buffer will be default
     */
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((path, index) => __awaiter(this, void 0, void 0, function* () { return callback(AV.newFfmpeg(path), tmpFile, index, path); })));
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