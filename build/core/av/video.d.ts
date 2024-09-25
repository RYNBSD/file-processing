/// <reference types="node" resolution-mode="require"/>
import type { FfprobeData } from "fluent-ffmpeg";
import type { AVSetCallback, VideoDrawTextOptions } from "../../types/index.js";
import AV from "./av.js";
export default class Video extends AV {
    constructor(...videos: Buffer[]);
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
    getVideos(): Buffer[];
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
    setVideos<T>(callback: AVSetCallback<T>): Promise<number>;
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
    append(...videos: Buffer[]): Promise<number>;
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
    extend(...videos: Video[]): number;
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
    clone(): Video;
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
    filter(): Promise<number>;
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
    only(): Promise<Buffer[]>;
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
    audio(format: string): Promise<(Buffer | null)[]>;
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
    screenshot(timemarks: number[] | string[]): Promise<Buffer[][]>;
    drawText(...options: VideoDrawTextOptions[]): Promise<Buffer[]>;
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
    static filter(...videos: Buffer[]): Promise<Buffer[]>;
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
    static fromFile(...path: string[]): Promise<Video>;
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
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Video>;
    /**
     * generate timemarks to take video screenshots
     *
     * @param metadata video metadata
     * @param interval interval between each timemark (seconds)
     *
     * @example
     * ```js
     *  // Video length: 10 seconds
     *  const video = await Video.fromFile("video.mp4")
     *  const metadata = await video.metadata()
     *  const timemarks = Video.generateTimemarks(metadata[0], 2)
     *  // => [0, 2, 4, 6, 8, 10]
     * ```
     */
    static generateTimemarks<T extends FfprobeData>(metadata: T, interval: number): Promise<number[]>;
    static generateTimemarks<T extends FfprobeData[]>(metadata: T, interval: number): Promise<number[][]>;
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
    static new(videos: Buffer[]): Promise<Video>;
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
    static isVideo(obj: unknown): obj is Video;
}
//# sourceMappingURL=video.d.ts.map