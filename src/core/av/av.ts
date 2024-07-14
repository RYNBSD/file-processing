import type { AVCustomCallback } from "../../types/index.js";
import type { Readable } from "node:stream";
import ffmpeg, { type FfprobeData } from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import path from "node:path";
import { FilterFile, TmpFile } from "../../helper/index.js";
import Core from "../core.js";

export default abstract class AV extends Core {
  protected avs: Buffer[];

  constructor(...avs: Buffer[]) {
    super();
    this.avs = avs;
  }

  get length() {
    return this.avs.length;
  }

  override clean() {
    this.avs = [];
  }

  override async metadata() {
    return this.custom(async (command) => {
      return new Promise<FfprobeData>((resolve, reject) => {
        command.ffprobe((err, metadata) => {
          if (err) return reject(err);
          resolve(metadata);
        });
      });
    });
  }

  async convert(format: string) {
    return this.custom(async (command, tmpFile) => {
      return new Promise<Buffer>((resolve, reject) => {
        const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));
        command
          .on("end", () => {
            Core.loadFile(output).then(resolve, reject);
          })
          .on("error", reject)
          .output(output)
          .run();
      });
    });
  }

  async spilt(duration: number, start: number = 0) {
    return this.custom(async (command, tmpFile, index) => {
      const metadata = await new Promise<FfprobeData>((resolve, reject) => {
        command.ffprobe((error, metadata) => {
          if (error) return reject(error);
          resolve(metadata);
        });
      });

      const avDuration = metadata.format.duration ?? 0;
      if (avDuration === 0) throw new Error(`${AV.name}: Empty av duration`);

      if (start >= avDuration) throw new Error(`${AV.name}: start time is bigger then the av duration`);

      const format = (await FilterFile.extension(this.avs[index]!)) ?? "";
      if (format.length === 0) throw new Error(`${AV.name}: Unknown av format`);

      //? High performance and High memory consumption
      // const splitMap: { start: number; duration: number }[] = [];
      // for (let start = 0; start < avDuration; start += duration) {
      //   const validDuration = Math.min(duration, avDuration - start);
      //   splitMap.push({ start, duration: validDuration });
      // }

      // return Promise.all(
      //   splitMap.map(({ start, duration }) => {
      //     return new Promise<Buffer>((resolve, reject) => {
      //       const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));
      //       command
      //         .setStartTime(start)
      //         .setDuration(duration)
      //         .on("end", () => {
      //           Core.loadFile(output).then(resolve, reject);
      //         })
      //         .on("error", reject)
      //         .output(output)
      //         .run();
      //     });
      //   }),
      // );

      const avPath = tmpFile.paths[index]!;
      const chunks: Buffer[] = [];
      let i = start;

      while (i < avDuration) {
        const validDuration = Math.min(duration, avDuration - i);
        const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));

        const chunk = await new Promise<Buffer>((resolve, reject) => {
          AV.newFfmpeg(avPath)
            .setStartTime(i)
            .setDuration(validDuration)
            .on("end", () => {
              Core.loadFile(output).then(resolve, reject);
            })
            .on("error", reject)
            .output(output)
            .run();
        });

        chunks.push(chunk);
        i += validDuration;
      }
      return chunks;
    });
  }

  async merge(format: string) {
    const converted = await this.convert(format);
    const tmpFile = await new TmpFile(...converted).init();
    const output = TmpFile.generateFileName(format);

    const merged = await new Promise<Buffer>((resolve, reject) => {
      const command = AV.newFfmpeg(tmpFile.paths[0]!);

      tmpFile.paths.forEach((av, index) => {
        if (index === 0) return;
        command.addInput(av);
      });

      command
        .mergeToFile(output, tmpFile.tmp!.path)
        .on("end", () => {
          const outputPath = path.join(tmpFile.tmp!.path, output);
          Core.loadFile(outputPath).then(resolve, reject);
        })
        .on("error", reject)
        .run();
    });

    await tmpFile.clean();
    return merged;
  }

  /**
   * In case of invalid method, buffer will be default
   */
  async custom<T>(callback: AVCustomCallback<T>): Promise<Awaited<T>[]> {
    const tmpFile = await new TmpFile(...this.avs).init();
    const result = await Promise.all(
      tmpFile.paths.map(async (path, index) => callback(AV.newFfmpeg(path), tmpFile, index)),
    );
    await tmpFile.clean();
    return result;
  }

  static async generateTimemarks<T extends FfprobeData>(metadata: T, interval: number): Promise<number[]>;
  static async generateTimemarks<T extends FfprobeData[]>(metadata: T, interval: number): Promise<number[][]>;
  static async generateTimemarks<T extends FfprobeData | FfprobeData[]>(metadata: T, interval = 1) {
    if (Array.isArray(metadata)) return Promise.all(metadata.map((mt) => AV.generateTimemarks(mt, interval)));

    const timemarks: number[] = [];
    const duration = metadata.format.duration ?? 0;
    for (let i = 0; i < duration; i += interval) timemarks.push(i);
    return timemarks;
  }

  /**
   * new Instance of ffmpeg
   */
  static newFfmpeg<T extends Readable | string>(av: T, options?: ffmpeg.FfmpegCommandOptions) {
    return ffmpeg(options).clone().setFfmpegPath(ffmpegPath).setFfprobePath(ffprobePath).input(av);
  }
}
