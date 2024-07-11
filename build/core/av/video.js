var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FilterFile, TmpFile } from "../../helper/index.js";
import path from "node:path";
import AV from "./av.js";
export default class Video extends AV {
    constructor(...videos) {
        super(...videos);
    }
    getVideos() {
        return [...this.avs];
    }
    setVideos(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield Promise.all(this.avs.map((video, index) => __awaiter(this, void 0, void 0, function* () { return callback(video, index); })));
            const filteredVideos = videos.filter((video) => Buffer.isBuffer(video) && video.length > 0);
            const validVideos = yield Video.filter(...filteredVideos);
            this.avs = validVideos;
            return this.length;
        });
    }
    append(...videos) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredVideos = yield Video.filter(...videos);
            this.avs.push(...filteredVideos);
            return this.length;
        });
    }
    extend(...videos) {
        videos.forEach((video) => {
            this.avs.push(...video.getVideos());
        });
        return this.length;
    }
    clone() {
        return new Video(...this.avs);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.avs = yield Video.filter(...this.avs);
            return this.length;
        });
    }
    only() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command, tmpFile, index) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const format = (_a = (yield FilterFile.extension(this.avs[index]))) !== null && _a !== void 0 ? _a : "";
                if (format.length === 0)
                    throw new Error(`${Video.name}: Unknown video format`);
                const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                return new Promise((resolve, reject) => {
                    command
                        .noAudio()
                        .on("end", () => {
                        AV.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .output(output)
                        .run();
                });
            }));
        });
    }
    audio(format) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadatas = yield this.metadata();
            return this.custom((command, tmpFile, index) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const metadata = metadatas[index];
                const audioStream = (_a = metadata.streams.find((stream) => stream.codec_type === "audio")) !== null && _a !== void 0 ? _a : null;
                if (audioStream === null)
                    return null;
                const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                return new Promise((resolve, reject) => {
                    command
                        .noVideo()
                        .toFormat(format)
                        .on("end", () => {
                        AV.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .output(output)
                        .run();
                });
            }));
        });
    }
    /** Extract video frames aka images */
    frame(timemarks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command, tmpFile) => __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    command
                        .takeScreenshots({ filename: "frame.jpg", timemarks }, tmpFile.tmp.path)
                        .on("filenames", (filenames) => {
                        const fullPaths = filenames.map((filename) => path.join(tmpFile.tmp.path, filename));
                        AV.loadFile(fullPaths).then(resolve, reject);
                    })
                        .on("error", reject)
                        .run();
                });
            }));
        });
    }
    static filter(...videos) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...videos).video();
        });
    }
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield AV.loadFile(path);
            return Video.new(buffer);
        });
    }
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield AV.loadUrl(url);
            return Video.new(buffer);
        });
    }
    static new(videos) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtered = yield Video.filter(...videos);
            if (filtered.length === 0)
                throw new Error(`${Video.name}: Non valid video`);
            return new Video(...filtered);
        });
    }
    /**
     * check if an object is instance of Video or not
     * @returns - boolean
     *
     * @example
     * ```js
     *  const video = new Video()
     *  const isVideo = Video.isVideo(video)
     *  // => true
     *
     *  const object = new Object()
     *  const isNotVideo = Video.isVideo(object)
     *  // => false
     * ```
     */
    static isVideo(obj) {
        return obj instanceof Video;
    }
}
//# sourceMappingURL=video.js.map