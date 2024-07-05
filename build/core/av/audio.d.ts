/// <reference types="node" resolution-mode="require"/>
import type { AVSetCallback } from "../../types/index.js";
import AV from "./av.js";
export default class Audio extends AV {
    constructor(...audios: Buffer[]);
    getAudios(): Buffer[];
    setAudios<T>(callback: AVSetCallback<T>): Promise<number>;
    append(...audios: Buffer[]): Promise<number>;
    extend(...audios: Audio[]): number;
    clone(): Audio;
    filter(): Promise<number>;
    static filter(...audios: Buffer[]): Promise<Buffer[]>;
    static fromFile(...path: string[]): Promise<Audio>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Audio>;
    static new(audios: Buffer[]): Promise<Audio>;
    static isAudio(obj: unknown): obj is Audio;
}
//# sourceMappingURL=audio.d.ts.map