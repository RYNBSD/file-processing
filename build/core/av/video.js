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
import { FilterFile, loader, TmpFile } from "../../helper/index.js";
import { ProcessorError } from "../../error/index.js";
import AV from "./av.js";
export default class Video extends AV {
    constructor(...videos) {
        super(...videos);
    }
    /**
     * get videos of this instance
     *
     * @example
     * ```js
     *  const buffer = await Video.loadFile("video.mp4")
     *
     *  // not the same reference
     *  const videos = new Video(buffer).getVideos()
     *  // => Buffer[]
     * ```
     */
    getVideos() {
        return [...this.avs];
    }
    /**
     * set videos
     *
     * @returns - new length
     *
     * @example
     * ```js
     *  const video = await Video.fromFile("video.mp4")
     *
     *  // this method filter invalid videos before set
     *  const newLength = await video.setVideos(\* async *\(video, index) => {
     *    return index % 2 ? video : video.toString()
     *  })
     *  // => 0
     * ```
     */
    setVideos(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield Promise.all(this.avs.map((video, index) => __awaiter(this, void 0, void 0, function* () { return callback(video, index); })));
            const filteredVideos = videos.filter((video) => Buffer.isBuffer(video) && video.length > 0);
            const validVideos = yield Video.filter(...filteredVideos);
            this.avs = validVideos;
            return this.length;
        });
    }
    /**
     *
     * @param videos - new videos (Buffer) to append the exists list
     * @returns - new length
     *
     * @example
     * ```js
     *  const video = new Video()
     *  const buffer1 = await Video.loadFile("video1.mp4")
     *  const buffer2 = await Video.loadFile("video2.mp4")
     *
     *  // filter invalid videos
     *  await video.append(buffer1, Buffer.alloc(1), buffer2)
     *  // => 2
     * ```
     */
    append(...videos) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredVideos = yield Video.filter(...videos);
            this.avs.push(...filteredVideos);
            return this.length;
        });
    }
    /**
     *
     * @param videos - extend videos from instance to an another
     * @returns - new length
     *
     * @example
     * ```js
     *  const buffer1 = await Video.loadFile("video1.mp4")
     *  const buffer2 = await Video.loadFile("video2.mp4")
     *  const video1 = new Video(buffer1, buffer2)
     *
     *  const video2 = new Video()
     *
     *  // don't apply any filters
     *  video2.extend(video1)
     *  // => 2
     * ```
     */
    extend(...videos) {
        videos.forEach((video) => {
            this.avs.push(...video.getVideos());
        });
        return this.length;
    }
    /**
     *
     * @returns - clone current instance
     *
     * @example
     * ```js
     *  const video = new Video()
     *
     *  // not the same reference
     *  const clone = video.clone()
     *  // => Video
     * ```
     */
    clone() {
        return new Video(...this.avs);
    }
    /**
     * filter videos
     * @returns - new length
     *
     * @example
     * ```js
     *  const video = new Video(Buffer.alloc(1))
     *  await video.filter()
     *  // => 0
     * ```
     */
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.avs = yield Video.filter(...this.avs);
            return this.length;
        });
    }
    /**
     * Remove audio from video
     * @returns muted videos
     *
     * @example
     * ```js
     *  const video = await Video.fromFile("video.mp4")
     *  const videos = await video.only()
     *  // => Buffer[]
     * ```
     */
    only() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command, tmpFile, index) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const format = (_a = (yield FilterFile.extension(this.avs[index]))) !== null && _a !== void 0 ? _a : "";
                if (format.length === 0)
                    throw ProcessorError.video("Unknown video format");
                const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                return new Promise((resolve, reject) => {
                    command
                        .noAudio()
                        .on("end", () => {
                        loader.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .output(output)
                        .run();
                });
            }));
        });
    }
    /**
     * Extract audio from video
     * @param format audio format
     * @returns audio buffer
     *
     * @example
     * ```js
     *  const video = await Video.fromFile("video.mp4")
     *  const audios = await video.audio("mp3")
     *  // => (Buffer | null)[]
     * ```
     */
    audio(format) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadatas = yield this.metadata();
            return this.custom((command, tmpFile, index) => __awaiter(this, void 0, void 0, function* () {
                const metadata = metadatas[index];
                const audioStream = metadata.streams.find((stream) => stream.codec_type === "audio");
                if (typeof audioStream === "undefined")
                    return null;
                const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                return new Promise((resolve, reject) => {
                    command
                        .noVideo()
                        .toFormat(format)
                        .on("end", () => {
                        loader.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .output(output)
                        .run();
                });
            }));
        });
    }
    /**
     * take screenshots from video
     * @param timemarks where we take screenshot (seconds)
     * @returns image in png format
     *
     * @example
     * ```js
     *  //Video length: 10 seconds
     *  const video = await Video.fromFile("video.mp4")
     *  const images = await video.screenshot([0, 1, 2, 3])
     *  // => Buffer[][]
     * ```
     */
    screenshot(timemarks) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command, tmpFile) => __awaiter(this, void 0, void 0, function* () {
                let imagesPath = [];
                return new Promise((resolve, reject) => {
                    command
                        .screenshot({ filename: "frame.png", timemarks }, tmpFile.tmp.path)
                        .on("filenames", (filenames) => {
                        imagesPath = filenames.map((filename) => path.join(tmpFile.tmp.path, filename));
                    })
                        .on("end", () => {
                        loader.loadFile(imagesPath).then(resolve, reject);
                    })
                        .on("error", reject);
                });
            }));
        });
    }
    drawText(...options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((command, tmpFile, index) => __awaiter(this, void 0, void 0, function* () {
                const format = yield FilterFile.extension(tmpFile.paths[index]);
                if (typeof format === "undefined")
                    throw ProcessorError.video("ERROR: undefined video (Video.drawText)");
                const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName(format));
                return new Promise((resolve, reject) => {
                    command
                        .videoFilter(options.map((option) => ({
                        filter: "drawtext",
                        options: option,
                    })))
                        .output(output)
                        .on("end", () => {
                        loader.loadFile(output).then(resolve, reject);
                    })
                        .on("error", reject)
                        .run();
                });
            }));
        });
    }
    /**
     *
     * @returns - filter non video
     *
     * @example
     * ```js
     *  const video1 = await Video.loadFile("video1.mp4")
     *  const video2 = await Video.loadFile("video2.mp4")
     *
     *  const buffer = await Video.filter(video1, video2)
     *  // => Buffer[]
     * ```
     */
    static filter(...videos) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...videos).video();
        });
    }
    /**
     * @throws
     *
     * load videos from files
     * @returns - loaded files
     *
     * @example
     * ```js
     *  const video = await Video.fromFile("video.mp4")
     *  // => Video
     *
     *  const video = await Video.fromFile("video.mp4", "text.txt")
     *  // => Video
     *  const length = video.length
     *  // => 1
     *
     *  const text = await Video.fromFile("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield loader.loadFile(path);
            return Video.new(buffer);
        });
    }
    /**
     * @throws
     *
     * load videos from urls
     * @returns - loaded urls
     *
     * @example
     * ```js
     *  const video = await Video.fromUrl("http://example.com/video.mp4")
     *  // => Video
     *
     *  const video = await Video.fromUrl("http://example.com/video.mp4", "http://example.com/text.txt")
     *  // => Video
     *  const length = video.length
     *  // => 1
     *
     *  const text = await Video.fromUrl("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield loader.loadUrl(url);
            return Video.new(buffer);
        });
    }
    static generateTimemarks(metadata_1) {
        return __awaiter(this, arguments, void 0, function* (metadata, interval = 1) {
            var _a;
            if (Array.isArray(metadata))
                return Promise.all(metadata.map((mt) => Video.generateTimemarks(mt, interval)));
            const timemarks = [];
            const duration = (_a = metadata.format.duration) !== null && _a !== void 0 ? _a : 0;
            for (let i = 0; i < duration; i += interval)
                timemarks.push(i);
            return timemarks;
        });
    }
    /**
     * @throws
     *
     * @param videos - videos buffer
     * @returns - create new safe instance
     *
     * @example
     * ```js
     *  const video = await Video.new(Buffer.alloc(1))
     *  // => Error (throw)
     *
     *  const videoFile = await Video.loadFile("video.mp3")
     *
     *  // filter non video
     *  const video = await Video.new(videoFile, Buffer.alloc(1))
     *  // => Video
     *  const length = video.length
     *  // => 1
     * ```
     */
    static new(videos) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtered = yield Video.filter(...videos);
            if (filtered.length === 0)
                throw ProcessorError.video("Non valid video");
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