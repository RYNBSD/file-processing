/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { AVCustomCallback } from "../../types/index.js";
import type { Readable } from "node:stream";
import ffmpeg, { type FfprobeData } from "fluent-ffmpeg";
import Core from "../core.js";
export default abstract class AV extends Core {
    protected avs: Buffer[];
    constructor(...avs: Buffer[]);
    get length(): number;
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
    clean(): void;
    metadata(): Promise<ffmpeg.FfprobeData[]>;
    convert(format: string): Promise<Buffer[]>;
    spilt(duration: number, start?: number): Promise<Buffer[][]>;
    merge(format: string, fps?: number): Promise<Buffer>;
    /**
     * In case of invalid method, buffer will be default
     */
    custom<T>(callback: AVCustomCallback<T>): Promise<Awaited<T>[]>;
    static generateTimemarks<T extends FfprobeData>(metadata: T, interval: number): Promise<number[]>;
    static generateTimemarks<T extends FfprobeData[]>(metadata: T, interval: number): Promise<number[][]>;
    /**
     * new Instance of ffmpeg
     */
    static newFfmpeg<T extends Readable | string>(av: T, options?: ffmpeg.FfmpegCommandOptions): ffmpeg.FfmpegCommand;
}
//# sourceMappingURL=av.d.ts.map