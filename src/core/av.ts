import type { AVCustomCallback, AVSetCallback } from "../types/index.js";
import type { Readable } from "node:stream";
import ffmpeg, { type FfprobeData } from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { FilterFile, TmpFile } from "../helper/index.js";
import Core from "./core.js";

abstract class AV extends Core {
  protected avs: Buffer[];

  constructor(...avs: Buffer[]) {
    super();
    this.avs = avs;
  }

  get length() {
    return this.avs.length;
  }

  override async metadata() {
    const tmpFile = await new TmpFile(...this.avs).init();
    const result = await Promise.all(
      tmpFile.paths.map(
        async (av) =>
          new Promise<FfprobeData>((resolve, reject) => {
            AV.newFfmpeg(av).ffprobe((err, metadata) => {
              if (err) return reject(err);
              resolve(metadata);
            });
          }),
      ),
    );
    await tmpFile.clean();
    return result;
  }

  async convert(format: string, options?: ffmpeg.FfmpegCommandOptions) {
    const tmpFile = await new TmpFile(...this.avs).init();

    const result = await Promise.all(
      tmpFile.paths.map(async (p) => {
        return new Promise<Buffer>((resolve, reject) => {
          const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));
          AV.newFfmpeg(p, options)
            .on("end", () => {
              readFile(output).then(resolve).catch(reject);
            })
            .on("error", reject)
            .output(output, { end: true })
            .run();
        });
      }),
    );

    await tmpFile.clean();
    return result;
  }

  // async stream() {
  //   const reads = await Core.toReadable(this.avs);
  //   return reads.map((av) => AV.newFfmpeg(av).pipe());
  // }

  /**
   * In case of invalid method, buffer will be default
   */
  async custom<T>(callback: AVCustomCallback<T>): Promise<Awaited<T>[]> {
    const tmpFile = await new TmpFile(...this.avs).init();
    const result = await Promise.all(tmpFile.paths.map(async (path, index) => callback(AV.newFfmpeg(path), index)));
    await tmpFile.clean();
    return result;
  }

  /**
   * new Instance of ffmpeg
   */
  static newFfmpeg<T extends Readable | string>(av: T, options?: ffmpeg.FfmpegCommandOptions) {
    return ffmpeg(options).clone().setFfmpegPath(ffmpegPath).setFfprobePath(ffprobePath).input(av);
  }
}

export class Video extends AV {
  constructor(...videos: Buffer[]) {
    super(...videos);
  }

  getVideos() {
    return [...this.avs];
  }

  async setVideos<T>(callback: AVSetCallback<T>) {
    const videos = await Promise.all(this.avs.map(async (video, index) => callback(video, index)));

    const filteredVideos = videos.filter((video) => Buffer.isBuffer(video) && video.length > 0) as Buffer[];
    const validVideos = await Video.filter(...filteredVideos);

    this.avs = validVideos;
    return this.length;
  }

  override async append(...videos: Buffer[]) {
    const filteredVideos = await Video.filter(...videos);
    this.avs.push(...filteredVideos);
  }

  override extend(...videos: Video[]) {
    videos.forEach((video) => {
      this.avs.push(...video.getVideos());
    });
  }

  override clone() {
    return new Video(...this.avs);
  }

  override async filter() {
    this.avs = await Video.filter(...this.avs);
    return this.length;
  }

  static async filter(...videos: Buffer[]) {
    return new FilterFile(...videos).video();
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    const videos = await Video.filter(...buffer);
    return new Video(...videos);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    const videos = await Video.filter(...buffer);
    return new Video(...videos);
  }
}

export class Audio extends AV {
  constructor(...audios: Buffer[]) {
    super(...audios);
  }

  getAudios() {
    return [...this.avs];
  }

  async setAudios<T>(callback: AVSetCallback<T>) {
    const audios = await Promise.all(this.avs.map(async (audio, index) => callback(audio, index)));

    const filteredAudios = audios.filter((audio) => Buffer.isBuffer(audio) && audio.length > 0) as Buffer[];
    const validAudios = await Audio.filter(...filteredAudios);

    this.avs = validAudios;
    return this.length;
  }

  override async append(...audios: Buffer[]) {
    const filteredAudios = await Audio.filter(...audios);
    this.avs.push(...filteredAudios);
  }

  override extend(...audios: Audio[]) {
    audios.forEach((audio) => {
      this.avs.push(...audio.getAudios());
    });
  }

  override clone() {
    return new Audio(...this.avs);
  }

  override async filter() {
    this.avs = await Audio.filter(...this.avs);
    return this.length;
  }

  static filter(...audios: Buffer[]) {
    return new FilterFile(...audios).audio();
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    const audios = await Audio.filter(...buffer);
    return new Audio(...audios);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    const audios = await Audio.filter(...buffer);
    return new Audio(...audios);
  }
}
