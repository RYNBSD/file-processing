/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { AVCustomCallback } from "../../types/index.js";
import type { Readable } from "node:stream";
import ffmpeg from "fluent-ffmpeg";
import Core from "../core.js";
export default abstract class AV extends Core {
    protected avs: Buffer[];
    constructor(...avs: Buffer[]);
    get length(): number;
    metadata(): Promise<ffmpeg.FfprobeData[]>;
    convert(format: string, options?: ffmpeg.FfmpegCommandOptions): Promise<Buffer[]>;
    /**
     * In case of invalid method, buffer will be default
     */
    custom<T>(callback: AVCustomCallback<T>): Promise<Awaited<T>[]>;
    /**
     * new Instance of ffmpeg
     */
    static newFfmpeg<T extends Readable | string>(av: T, options?: ffmpeg.FfmpegCommandOptions): ffmpeg.FfmpegCommand;
}
//# sourceMappingURL=av.d.ts.map