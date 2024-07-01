import type { AVCustomCallback } from "../../types/index.js";
import type { Readable } from "node:stream";
import ffmpeg, { type FfprobeData } from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import path from "node:path";
import { TmpFile } from "../../helper/index.js";
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
              Core.loadFile(output).then(resolve).catch(reject);
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
