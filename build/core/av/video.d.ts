/// <reference types="node" resolution-mode="require"/>
import type { AVSetCallback } from "../../types/index.js";
import AV from "./av.js";
export declare class Video extends AV {
    constructor(...videos: Buffer[]);
    getVideos(): Buffer[];
    setVideos<T>(callback: AVSetCallback<T>): Promise<number>;
    append(...videos: Buffer[]): Promise<void>;
    extend(...videos: Video[]): void;
    clone(): Video;
    filter(): Promise<number>;
    static filter(...videos: Buffer[]): Promise<Buffer[]>;
    static fromFile(...path: string[]): Promise<Video>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Video>;
}
//# sourceMappingURL=video.d.ts.map