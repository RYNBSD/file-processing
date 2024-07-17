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

  /** get current length of avs */
  get length() {
    return this.avs.length;
  }

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
  override clean() {
    this.avs = [];
  }

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
  override async metadata() {
    return this.custom((command) => {
      return new Promise<FfprobeData>((resolve, reject) => {
        command.ffprobe((err, metadata) => {
          if (err) return reject(err);
          resolve(metadata);
        });
      });
    });
  }

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
  async convert(format: string) {
    return this.custom((command, tmpFile) => {
      return new Promise<Buffer>((resolve, reject) => {
        const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));
        command
          .toFormat(format)
          .on("end", () => {
            Core.loadFile(output).then(resolve, reject);
          })
          .on("error", reject)
          .output(output)
          .run();
      });
    });
  }

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
  async merge(format: string, fps: number = 30) {
    const converted = await this.convert(format);
    const tmpFile = await new TmpFile(...converted).init();
    const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));

    console.log("Merge start");
    const merged = await new Promise<Buffer>((resolve, reject) => {
      const command = AV.newFfmpeg(tmpFile.paths[0]!);

      tmpFile.paths.forEach((av, index) => {
        if (index === 0) return;
        command.input(av);
      });

      command
        .fps(fps)
        .on("start", (commandLine) => {
          console.log("Spawned FFmpeg with command: " + commandLine);
        })
        .on("end", () => {
          Core.loadFile(output).then(resolve, reject);
        })
        .on("error", reject)
        .mergeToFile(output, tmpFile.tmp!.path);
    });

    await tmpFile.clean();
    return merged;
  }

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
  async custom<T>(callback: AVCustomCallback<T>): Promise<Awaited<T>[]> {
    const tmpFile = await new TmpFile(...this.avs).init();
    const result = await Promise.all(
      tmpFile.paths.map(async (path, index) => callback(AV.newFfmpeg(path), tmpFile, index)),
    );
    await tmpFile.clean();
    return result;
  }

  /**
   * @returns new instance of ffmpeg
   *
   * @example
   * ```js
   *  const command = Video.newFfmpeg("video.mp4")
   *  // => FfmpegCommand
   * ```
   */
  static newFfmpeg<T extends Readable | string>(av: T, options?: ffmpeg.FfmpegCommandOptions) {
    return ffmpeg(options).clone().setFfmpegPath(ffmpegPath).setFfprobePath(ffprobePath).input(av);
  }
}
