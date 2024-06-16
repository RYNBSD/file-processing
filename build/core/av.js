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
import { buffer2readable, readable2buffer } from "@ryn-bsd/from-buffer-to";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { FilterFile, TmpFile } from "../helper/index.js";
import Core from "./core.js";
class AV extends Core {
    constructor(...avs) {
        super();
        this.avs = avs;
    }
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((av) => new Promise((resolve, reject) => {
                AV.newFfmpeg(av).ffprobe((err, metadata) => {
                    if (err)
                        return reject(err);
                    return resolve(metadata);
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
                        readFile(output).then(resolve).catch(reject);
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
    /**
     * In case of invalid method, buffer will be default
     */
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(...this.avs).init();
            const result = yield Promise.all(tmpFile.paths.map((path, index) => callback(AV.newFfmpeg(path), index)));
            yield tmpFile.clean();
            return result;
        });
    }
    /**
     * Raw version of stream
     */
    static stream(readable, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = AV.newFfmpeg(readable);
            return callback(command);
        });
    }
    /**
     * Raw version of buffer
     */
    static buffer(buffer, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmpFile = yield new TmpFile(buffer).init();
            const command = AV.newFfmpeg(tmpFile.paths[0]);
            const result = yield callback(command);
            yield tmpFile.clean();
            return result;
        });
    }
    static toBuffer(readable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(readable))
                return readable2buffer(readable);
            return Promise.all(readable.map((rd) => AV.toBuffer(rd)));
        });
    }
    static toReadable(readers) {
        if (!Array.isArray(readers))
            return buffer2readable(readers);
        return readers.map((reader) => AV.toReadable(reader));
    }
    /**
     * new Instance of ffmpeg
     */
    static newFfmpeg(av, options) {
        return ffmpeg(options)
            .clone()
            .setFfmpegPath(ffmpegPath)
            .setFfprobePath(ffprobePath)
            .input(av);
    }
}
export class Video extends AV {
    constructor(...videos) {
        super(...videos);
        this.videos = videos;
    }
    getVideos() {
        return [...this.videos];
    }
    setVideos(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield Promise.all(this.videos.map((video, index) => callback(video, index)));
            const filteredVideos = videos.filter((video) => Buffer.isBuffer(video));
            this.videos = filteredVideos;
        });
    }
    appendVideos(...videos) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredVideos = yield Video.filter(...videos);
            this.videos.push(...filteredVideos);
        });
    }
    extendVideos(...videos) {
        videos.forEach((video) => {
            this.videos.push(...video.getVideos());
        });
    }
    clone() {
        return new Video(...this.videos);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.videos = yield Video.filter(...this.videos);
            return this.videos.length;
        });
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield Video.filter(...this.videos);
            if (videos.length === 0)
                throw new TypeError(`${Video.name}: Files must be of type video`);
        });
    }
    static filter(...videos) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...videos).video();
        });
    }
    static fromFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return new Video(buffer);
        });
    }
    static fromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return new Video(buffer);
        });
    }
}
export class Audio extends AV {
    constructor(...audios) {
        super(...audios);
        this.audios = audios;
    }
    getAudios() {
        return [...this.audios];
    }
    setAudios(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const audios = yield Promise.all(this.audios.map((audio, index) => callback(audio, index)));
            const filteredVideos = audios.filter((audio) => Buffer.isBuffer(audio));
            this.audios = filteredVideos;
        });
    }
    appendAudios() {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredAudios = yield Audio.filter(...this.audios);
            this.audios.push(...filteredAudios);
        });
    }
    clone() {
        return new Audio(...this.audios);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.audios = yield Audio.filter(...this.audios);
            return this.audios.length;
        });
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            const audios = yield Audio.filter(...this.audios);
            if (audios.length === 0)
                throw new TypeError(`${Audio.name}: Files must be of type audio`);
        });
    }
    static filter(...audios) {
        return new FilterFile(...audios).audio();
    }
    static fromFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return new Audio(buffer);
        });
    }
    static fromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return new Audio(buffer);
        });
    }
}
//# sourceMappingURL=av.js.map