import type { AVSetCallback } from "../../types/index.js";
import { FilterFile, TmpFile } from "../../helper/index.js";
import path from "node:path";
import type { FfprobeData } from "fluent-ffmpeg";
import AV from "./av.js";

export default class Video extends AV {
  constructor(...videos: Buffer[]) {
    super(...videos);
  }

  /**
   * get videos of this instance
   *
   * @example
   * ```js
   *  const buffer = await Video.loadFile("video.mp4")
   *
   *  // not the same reference
   *  const videos = new Video(buffer).getVideos()
   *  // => Buffer[]
   * ```
   */
  getVideos() {
    return [...this.avs];
  }

  /**
   * set videos
   *
   * @returns - new length
   *
   * @example
   * ```js
   *  const video = await Video.fromFile("video.mp4")
   *
   *  // this method filter invalid videos before set
   *  const newLength = await video.setVideos(\* async *\(video, index) => {
   *    return index % 2 ? video : video.toString()
   *  })
   *  // => 0
   * ```
   */
  async setVideos<T>(callback: AVSetCallback<T>) {
    const videos = await Promise.all(this.avs.map(async (video, index) => callback(video, index)));
    const filteredVideos = videos.filter((video) => Buffer.isBuffer(video) && video.length > 0) as Buffer[];
    const validVideos = await Video.filter(...filteredVideos);
    this.avs = validVideos;
    return this.length;
  }

  /**
   *
   * @param videos - new videos (Buffer) to append the exists list
   * @returns - new length
   *
   * @example
   * ```js
   *  const video = new Video()
   *  const buffer1 = await Video.loadFile("video1.mp4")
   *  const buffer2 = await Video.loadFile("video2.mp4")
   *
   *  // filter invalid videos
   *  await video.append(buffer1, Buffer.alloc(1), buffer2)
   *  // => 2
   * ```
   */
  override async append(...videos: Buffer[]) {
    const filteredVideos = await Video.filter(...videos);
    this.avs.push(...filteredVideos);
    return this.length;
  }

  /**
   *
   * @param videos - extend videos from instance to an another
   * @returns - new length
   *
   * @example
   * ```js
   *  const buffer1 = await Video.loadFile("video1.mp4")
   *  const buffer2 = await Video.loadFile("video2.mp4")
   *  const video1 = new Video(buffer1, buffer2)
   *
   *  const video2 = new Video()
   *
   *  // don't apply any filters
   *  video2.extend(video1)
   *  // => 2
   * ```
   */
  override extend(...videos: Video[]) {
    videos.forEach((video) => {
      this.avs.push(...video.getVideos());
    });
    return this.length;
  }

  /**
   *
   * @returns - clone current instance
   *
   * @example
   * ```js
   *  const video = new Video()
   *
   *  // not the same reference
   *  const clone = video.clone()
   *  // => Video
   * ```
   */
  override clone() {
    return new Video(...this.avs);
  }

  /**
   * filter videos
   * @returns - new length
   *
   * @example
   * ```js
   *  const video = new Video(Buffer.alloc(1))
   *  await video.filter()
   *  // => 0
   * ```
   */
  override async filter() {
    this.avs = await Video.filter(...this.avs);
    return this.length;
  }

  /**
   * Remove audio from video
   * @returns muted videos
   *
   * @example
   * ```js
   *  const video = await Video.fromFile("video.mp4")
   *  const videos = await video.only()
   *  // => Buffer[]
   * ```
   */
  async only() {
    return this.custom(async (command, tmpFile, index) => {
      const format = (await FilterFile.extension(this.avs[index]!)) ?? "";
      if (format.length === 0) throw new Error(`${Video.name}: Unknown video format`);

      const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));

      return new Promise<Buffer>((resolve, reject) => {
        command
          .noAudio()
          .on("end", () => {
            AV.loadFile(output).then(resolve, reject);
          })
          .on("error", reject)
          .output(output)
          .run();
      });
    });
  }

  /**
   * Extract audio from video
   * @param format audio format
   * @returns audio buffer
   *
   * @example
   * ```js
   *  const video = await Video.fromFile("video.mp4")
   *  const audios = await video.audio("mp3")
   *  // => (Buffer | null)[]
   * ```
   */
  async audio(format: string) {
    const metadatas = await this.metadata();
    return this.custom(async (command, tmpFile, index) => {
      const metadata = metadatas[index]!;
      const audioStream = metadata.streams.find((stream) => stream.codec_type === "audio");
      if (typeof audioStream === "undefined") return null;

      const output = path.join(tmpFile.tmp!.path, TmpFile.generateFileName(format));

      return new Promise<Buffer>((resolve, reject) => {
        command
          .noVideo()
          .toFormat(format)
          .on("end", () => {
            AV.loadFile(output).then(resolve, reject);
          })
          .on("error", reject)
          .output(output)
          .run();
      });
    });
  }

  /**
   * take screenshots from video
   * @param timemarks where we take screenshot (seconds)
   * @returns image in png format
   *
   * @example
   * ```js
   *  //Video length: 10 seconds
   *  const video = await Video.fromFile("video.mp4")
   *  const images = await video.screenshot([0, 1, 2, 3])
   *  // => Buffer[][]
   * ```
   */
  async screenshot(timemarks: number[] | string[]) {
    return this.custom(async (command, tmpFile) => {
      let imagesPath: string[] = [];

      return new Promise<Buffer[]>((resolve, reject) => {
        command
          .screenshot({ filename: "frame.png", timemarks }, tmpFile.tmp!.path)
          .on("filenames", (filenames: string[]) => {
            imagesPath = filenames.map((filename) => path.join(tmpFile.tmp!.path, filename));
          })
          .on("end", () => {
            AV.loadFile(imagesPath).then(resolve, reject);
          })
          .on("error", reject);
      });
    });
  }

  /**
   *
   * @returns - filter non video
   *
   * @example
   * ```js
   *  const video1 = await Video.loadFile("video1.mp4")
   *  const video2 = await Video.loadFile("video2.mp4")
   *
   *  const buffer = await Video.filter(video1, video2)
   *  // => Buffer[]
   * ```
   */
  static async filter(...videos: Buffer[]) {
    return new FilterFile(...videos).video();
  }

  /**
   * @throws
   *
   * load videos from files
   * @returns - loaded files
   *
   * @example
   * ```js
   *  const video = await Video.fromFile("video.mp4")
   *  // => Video
   *
   *  const video = await Video.fromFile("video.mp4", "text.txt")
   *  // => Video
   *  const length = video.length
   *  // => 1
   *
   *  const text = await Video.fromFile("text.txt")
   *  // => Error (throw)
   * ```
   */
  static async fromFile(...path: string[]) {
    const buffer = await AV.loadFile(path);
    return Video.new(buffer);
  }

  /**
   * @throws
   *
   * load videos from urls
   * @returns - loaded urls
   *
   * @example
   * ```js
   *  const video = await Video.fromUrl("http://example.com/video.mp4")
   *  // => Video
   *
   *  const video = await Video.fromUrl("http://example.com/video.mp4", "http://example.com/text.txt")
   *  // => Video
   *  const length = video.length
   *  // => 1
   *
   *  const text = await Video.fromUrl("text.txt")
   *  // => Error (throw)
   * ```
   */
  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await AV.loadUrl(url);
    return Video.new(buffer);
  }

  /**
   * generate timemarks to take video screenshots
   *
   * @param metadata video metadata
   * @param interval interval between each timemark (seconds)
   *
   * @example
   * ```js
   *  // Video length: 10 seconds
   *  const video = await Video.fromFile("video.mp4")
   *  const metadata = await video.metadata()
   *  const timemarks = Video.generateTimemarks(metadata[0], 2)
   *  // => [0, 2, 4, 6, 8, 10]
   * ```
   */
  static async generateTimemarks<T extends FfprobeData>(metadata: T, interval: number): Promise<number[]>;
  static async generateTimemarks<T extends FfprobeData[]>(metadata: T, interval: number): Promise<number[][]>;
  static async generateTimemarks<T extends FfprobeData | FfprobeData[]>(metadata: T, interval = 1) {
    if (Array.isArray(metadata)) return Promise.all(metadata.map((mt) => Video.generateTimemarks(mt, interval)));

    const timemarks: number[] = [];
    const duration = metadata.format.duration ?? 0;
    for (let i = 0; i < duration; i += interval) timemarks.push(i);
    return timemarks;
  }

  /**
   * @throws
   *
   * @param videos - videos buffer
   * @returns - create new safe instance
   *
   * @example
   * ```js
   *  const video = await Video.new(Buffer.alloc(1))
   *  // => Error (throw)
   *
   *  const videoFile = await Video.loadFile("video.mp3")
   *
   *  // filter non video
   *  const video = await Video.new(videoFile, Buffer.alloc(1))
   *  // => Video
   *  const length = video.length
   *  // => 1
   * ```
   */
  static async new(videos: Buffer[]) {
    const filtered = await Video.filter(...videos);
    if (filtered.length === 0) throw new Error(`${Video.name}: Non valid video`);
    return new Video(...filtered);
  }

  /**
   * check if an object is instance of Video or not
   * @returns - boolean
   *
   * @example
   * ```js
   *  const video = new Video()
   *  const isVideo = Video.isVideo(video)
   *  // => true
   *
   *  const object = new Object()
   *  const isNotVideo = Video.isVideo(object)
   *  // => false
   * ```
   */
  static isVideo(obj: unknown): obj is Video {
    return obj instanceof Video;
  }
}
