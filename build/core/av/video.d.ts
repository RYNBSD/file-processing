/// <reference types="node" resolution-mode="require"/>
import type { AVSetCallback } from "../../types/index.js";
import type { FfprobeData } from "fluent-ffmpeg";
import AV from "./av.js";
export default class Video extends AV {
    constructor(...videos: Buffer[]);
    getVideos(): Buffer[];
    setVideos<T>(callback: AVSetCallback<T>): Promise<number>;
    append(...videos: Buffer[]): Promise<number>;
    extend(...videos: Video[]): number;
    clone(): Video;
    filter(): Promise<number>;
    only(): Promise<Buffer[]>;
    audio(format: string): Promise<(Buffer | null)[]>;
    /** Extract video frames aka images */
    screenshot(timemarks: number[] | string[]): Promise<Buffer[][]>;
    static filter(...videos: Buffer[]): Promise<Buffer[]>;
    static fromFile(...path: string[]): Promise<Video>;
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