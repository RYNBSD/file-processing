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
  private readonly avs: Buffer[];

  constructor(...avs: Buffer[]) {
    super();
    this.avs = avs;
  }

  override async metadata() {
    const tmpFile = await new TmpFile(...this.avs).init();
    const result = await Promise.all(
      tmpFile.paths.map(
        (av) =>
          new Promise<FfprobeData>((resolve, reject) => {
            AV.newFfmpeg(av).ffprobe((err, metadata) => {
              if (err) return reject(err);
              resolve(metadata);
            });
          })
      )
    );
    await tmpFile.clean();
    return result;
  }

  async convert(format: string, options?: ffmpeg.FfmpegCommandOptions) {
    const tmpFile = await new TmpFile(...this.avs).init();

    const result = await Promise.all(
      tmpFile.paths.map((p) => {
        return new Promise<Buffer>((resolve, reject) => {
          const output = path.join(
            tmpFile.tmp!.path,
            TmpFile.generateFileName(format)
          );
          AV.newFfmpeg(p, options)
            .on("end", () => {
              readFile(output).then(resolve).catch(reject);
            })
            .on("error", reject)
            .output(output, { end: true })
            .run();
        });
      })
    );

    await tmpFile.clean();
    return result;
  }

  /**
   * In case of invalid method, buffer will be default
   */
  async custom<T>(callback: AVCustomCallback<T>): Promise<Awaited<T>[]> {
    const tmpFile = await new TmpFile(...this.avs).init();
    const result = await Promise.all(
      tmpFile.paths.map((path, index) => callback(AV.newFfmpeg(path), index))
    );
    await tmpFile.clean();
    return result;
  }

  /**
   * Raw version of stream
   */
  // static async stream<T>(readable: Readable, callback: AVCallback<T>) {
  //   const command = AV.newFfmpeg(readable);
  //   return callback(command);
  // }

  /**
   * new Instance of ffmpeg
   */
  static newFfmpeg<T extends Readable | string>(
    av: T,
    options?: ffmpeg.FfmpegCommandOptions
  ) {
    return ffmpeg(options)
      .clone()
      .setFfmpegPath(ffmpegPath)
      .setFfprobePath(ffprobePath)
      .input(av);
  }
}

export class Video extends AV {
  private videos: Buffer[];

  constructor(...videos: Buffer[]) {
    super(...videos);
    this.videos = videos;
  }

  getVideos() {
    return [...this.videos];
  }

  async setVideos<T>(callback: AVSetCallback<T>) {
    const videos = await Promise.all(
      this.videos.map((video, index) => callback(video, index))
    );
    const filteredVideos = videos.filter((video) =>
      Buffer.isBuffer(video)
    ) as Buffer[];
    this.videos = filteredVideos;
  }

  override async append(...videos: Buffer[]) {
    const filteredVideos = await Video.filter(...videos);
    this.videos.push(...filteredVideos);
  }

  override extend(...videos: Video[]) {
    videos.forEach((video) => {
      this.videos.push(...video.getVideos());
    });
  }

  override clone() {
    return new Video(...this.videos);
  }

  override async filter() {
    this.videos = await Video.filter(...this.videos);
    return this.videos.length;
  }

  static async filter(...videos: Buffer[]) {
    return new FilterFile(...videos).video();
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    return new Video(...buffer);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    return new Video(...buffer);
  }
}

export class Audio extends AV {
  private audios: Buffer[];

  constructor(...audios: Buffer[]) {
    super(...audios);
    this.audios = audios;
  }

  getAudios() {
    return [...this.audios];
  }

  async setAudios<T>(callback: AVSetCallback<T>) {
    const audios = await Promise.all(
      this.audios.map((audio, index) => callback(audio, index))
    );
    const filteredVideos = audios.filter((audio) =>
      Buffer.isBuffer(audio)
    ) as Buffer[];
    this.audios = filteredVideos;
  }

  override async append(...audios: Buffer[]) {
    const filteredAudios = await Audio.filter(...audios);
    this.audios.push(...filteredAudios);
  }

  override extend(...audios: Audio[]) {
    audios.forEach((audio) => {
      this.audios.push(...audio.getAudios());
    });
  }

  override clone() {
    return new Audio(...this.audios);
  }

  override async filter() {
    this.audios = await Audio.filter(...this.audios);
    return this.audios.length;
  }

  static filter(...audios: Buffer[]) {
    return new FilterFile(...audios).audio();
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    return new Audio(...buffer);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    return new Audio(...buffer);
  }
}
