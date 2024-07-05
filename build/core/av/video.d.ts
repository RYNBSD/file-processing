/// <reference types="node" resolution-mode="require"/>
import type { AVSetCallback } from "../../types/index.js";
import AV from "./av.js";
export default class Video extends AV {
    constructor(...videos: Buffer[]);
    getVideos(): Buffer[];
    setVideos<T>(callback: AVSetCallback<T>): Promise<number>;
    append(...videos: Buffer[]): Promise<number>;
    extend(...videos: Video[]): number;
    clone(): Video;
    filter(): Promise<number>;
    static filter(...videos: Buffer[]): Promise<Buffer[]>;
    static fromFile(...path: string[]): Promise<Video>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Video>;
    static new(videos: Buffer[]): Promise<Video>;
    static isVideo(obj: unknown): obj is Video;
}
//# sourceMappingURL=video.d.ts.map