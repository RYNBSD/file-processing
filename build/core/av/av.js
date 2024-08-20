var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import { FilterFile, loader, TmpFile } from "../../helper/index.js";
import Core from "../core.js";
import { ProcessorError } from "../../error/processor.js";
export default class AV extends Core {
    constructor(...avs) {
        super();
        this.avs = avs;
    }
    /** get current length of avs */
    get length() {
        return this.avs.length;
    }
    /**
     * Clean avs array, to free memory
     *
     * @example
     * ```js
     *  const audio = await Audio.fromFile("audio1.wav", "audio2.mp3")
     *  const video = await Video.fromFile("video1.mov", "video2.mkv")
     *
     *  // Some operations
     *
     *  audio.clean()
     *  video.clean()
     *
     *  // Some operations
     *
     *  audio.append(Buffer.alloc(1))
     *  video.append(Buffer.alloc(1))
     * ```
     */
    clean() {
        this.avs = [];
    }
    /**
     * @returns - avs metadata
     *
     * @example
     * ```js
     *  const av1 = await Audio.loadFile("av1.wav")
     *  const av2 = await Audio.loadFile("av2.wav")
     *
     *  const av = new Audio(av1, av2)
     *  const metadata = await av.metadata()
     *  // => FfprobeData[]
     * ```
     */
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command) => {
                return new Promise((resolve, reject) => {
                    command.ffprobe((err, metadata) => {
                        if (err)
                            return reject(err);
                        resolve(metadata);
                    });
                });
            });
        });
    }
    /**
     * @returns converted avs
     *
     * @example
     * ```js
     *  const av1 = await Audio.loadFile("av1.wav")
     *  const av2 = await Audio.loadFile("av2.wav")
     *
     *  const av = new Audio(av1, av2)
     *  const buffers = await av.convert("mp3")
     *  // => Buffer[]
     * ```
     */
    convert(format) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command, tmpFile) => {
                return new Promise((resolve, reject) => {
                    const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                    command
                        .toFormat(format)
                        .on("end", () => {
                        loader.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .output(output)
                        .run();
                });
            });
        });
    }
    /**
     * @throws
     *
     * @param duration av chunk duration (seconds)
     * @param start start point @default 0
     * @returns all av chunks
     *
     * @example
     * ```js
     *  const video = await Video.fromFile("video1.mp3", "video2.mkv")
     *  const chunks = await video.split(60)
     *  // => Buffer[][]
     * ```
     */
    spilt(duration_1) {
        return __awaiter(this, arguments, void 0, function* (duration, start = 0) {
            return this.custom((command, tmpFile, index) => __awaiter(this, void 0, void 0, function* () {
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
                    throw ProcessorError.av("Empty av duration");
                if (start >= avDuration)
                    throw ProcessorError.av("start time is bigger then the av duration");
                const format = (_b = (yield FilterFile.extension(this.avs[index]))) !== null && _b !== void 0 ? _b : "";
                if (format.length === 0)
                    throw ProcessorError.av("Unknown av format");
                //? High performance and High memory consumption
                // const splitMap: { start: number; duration: number }[] = [];
                // for (let start = 0; start < avDuration; start += duration) {
                //   const validDuration = Math.min(duration, avDuration - start);
                //   splitMap.push({ start, duration: validDuration });
                // }
                // return Promise.all(
                //   splitMap.map(({ start, duration }) => {
                //     return new Promise<Buffer>((resolve, reject) => {
                //       const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));
                //       command
                //         .setStartTime(start)
                //         .setDuration(duration)
                //         .on("end", () => {
                //           loadFile(output).then(resolve, reject);
                //         })
                //         .on("error", reject)
                //         .output(output)
                //         .run();
                //     });
                //   }),
                // );
                const avPath = tmpFile.paths[index];
                const chunks = [];
                let i = start;
                while (i < avDuration) {
                    const validDuration = Math.min(duration, avDuration - i);
                    const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                    const chunk = yield new Promise((resolve, reject) => {
                        AV.newFfmpeg(avPath)
                            .setStartTime(i)
                            .setDuration(validDuration)
                            .on("end", () => {
                            loader.loadFile(output).then(resolve, reject);
                        })
                            .on("error", reject)
                            .output(output)
                            .run();
                    });
                    chunks.push(chunk);
                    i += validDuration;
                }
                return chunks;
            }));
        });
    }
    /**
     * merge all videos/audios in one video/audio
     *
     * @param format new format
     * @returns new video/audio
     *
     * @example
     * ```js
     * ```
     */
    merge(format) {
        return __awaiter(this, void 0, void 0, function* () {
            const converted = yield this.convert(format);
            const tmpFile = yield new TmpFile(...converted).init();
            const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
            console.log("Merge start");
            const merged = yield new Promise((resolve, reject) => {
                const command = AV.newFfmpeg(tmpFile.paths[0]);
                tmpFile.paths.forEach((av, index) => {
                    if (index === 0)
                        return;
                    command.input(av);
                });
                command
                    .on("start", (commandLine) => {
                    console.log("Spawned FFmpeg with command: " + commandLine);
                })
                    .on("end", () => {
                    loader.loadFile(output).then(resolve, reject);
                })
                    .on("error", reject)
                    .mergeToFile(output, tmpFile.tmp.path);
            });
            yield tmpFile.clean();
            return merged;
        });
    }
    /**
     * @returns base on the callback return type
     *
     * @example
     * ```js
     *  const av1 = await Audio.loadFile("av1.wav")
     *  const av2 = await Audio.loadFile("av2.wav")
     *
     *  const av = new Audio(av1, av2)
     *
     *  await av.custom(\* async *\(command, _index) => {
     *    return new Promise<Buffer>((resolve, reject) => {
     *      command.on("error", reject).on("end", () => {
     *        resolve(\* Some operations *\)
     *      })
     *    })
     *  })
     *  // => Buffer[]
     *
     *  await av.custom(\* async *\(_command, index) => {
     *    return index
     *  })
     *  // => number[]
     * ```
     */
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((path, index) => __awaiter(this, void 0, void 0, function* () { return callback(AV.newFfmpeg(path), tmpFile, index); })));
            yield tmpFile.clean();
            return result;
        });
    }
    // static async m<T extends string | stream.Readable | Buffer>(video: T, audio: T) {
    //   let videoInput: string | stream.Readable = "";
    //   if (video instanceof stream.Readable && stream.Readable.isReadable(video)) videoInput = video;
    //   else if (typeof video === "string") videoInput = video;
    //   else {
    //   }
    //   return new Promise((resolve, reject) => {
    //     AV.newFfmpeg(video)
    //       .input(audio)
    //       .on("end", () => {})
    //       .on("error", reject)
    //       .output()
    //       .run();
    //   });
    // }
    /**
     * @returns new instance of ffmpeg
     *
     * @example
     * ```js
     *  const command = Video.newFfmpeg("video.mp4")
     *  // => FfmpegCommand
     * ```
     */
    static newFfmpeg(av, options) {
        return ffmpeg(options).clone().setFfmpegPath(ffmpegPath).setFfprobePath(ffprobePath).input(av);
    }
}
//# sourceMappingURL=av.js.map