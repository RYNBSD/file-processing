/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { AVCustomCallback } from "../../types/index.js";
import stream from "node:stream";
import ffmpeg from "fluent-ffmpeg";
import Core from "../core.js";
export default abstract class AV extends Core {
    protected avs: Buffer[];
    constructor(...avs: Buffer[]);
    /** get current length of avs */
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
    metadata(): Promise<ffmpeg.FfprobeData[]>;
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
    convert(format: string): Promise<Buffer[]>;
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
    spilt(duration: number, start?: number): Promise<Buffer[][]>;
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
    merge(format: string): Promise<Buffer>;
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
    custom<T>(callback: AVCustomCallback<T>): Promise<Awaited<T>[]>;
    /**
     * @returns new instance of ffmpeg
     *
     * @example
     * ```js
     *  const command = Video.newFfmpeg("video.mp4")
     *  // => FfmpegCommand
     * ```
     */
    static newFfmpeg<T extends stream.Readable | string>(av: T, options?: ffmpeg.FfmpegCommandOptions): ffmpeg.FfmpegCommand;
}
//# sourceMappingURL=av.d.ts.map