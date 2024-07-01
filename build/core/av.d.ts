/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { AVCustomCallback, AVSetCallback } from "../types/index.js";
import type { Readable } from "node:stream";
import ffmpeg from "fluent-ffmpeg";
import Core from "./core.js";
declare abstract class AV extends Core {
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
export declare class Audio extends AV {
  constructor(...audios: Buffer[]);
  getAudios(): Buffer[];
  setAudios<T>(callback: AVSetCallback<T>): Promise<number>;
  append(...audios: Buffer[]): Promise<void>;
  extend(...audios: Audio[]): void;
  clone(): Audio;
  filter(): Promise<number>;
  static filter(...audios: Buffer[]): Promise<Buffer[]>;
  static fromFile(...path: string[]): Promise<Audio>;
  static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Audio>;
}
export {};
//# sourceMappingURL=av.d.ts.map
