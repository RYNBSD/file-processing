import type { AVSetCallback } from "../../types/index.js";
import { FilterFile, TmpFile } from "../../helper/index.js";
import path from "node:path";
import AV from "./av.js";

export default class Video extends AV {
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
    return this.length;
  }

  override extend(...videos: Video[]) {
    videos.forEach((video) => {
      this.avs.push(...video.getVideos());
    });
    return this.length;
  }

  override clone() {
    return new Video(...this.avs);
  }

  override async filter() {
    this.avs = await Video.filter(...this.avs);
    return this.length;
  }

  /** Extract text fromm videos */
  // async texts(langs: string | string[]) {
  //   const scheduler = createScheduler()
  // }

  /** Extract video frames aka images */
  async frames(timemarks: number[]) {
    const tmpFile = await new TmpFile(...this.avs).init();

    const frames = await Promise.all(
      tmpFile.paths.map((video) => {
        return new Promise<Buffer[]>((resolve, reject) => {
          Video.newFfmpeg(video)
            .takeScreenshots({ filename: "frame.jpg", timemarks }, tmpFile.tmp!.path)
            .on("filenames", (filenames: string[]) => {
              const fullPaths = filenames.map((filename) => path.join(tmpFile.tmp!.path, filename));
              AV.loadFile(fullPaths).then(resolve, reject);
            })
            .on("error", reject)
            .run();
        });
      }),
    );

    await tmpFile.clean();
    return frames;
  }

  static async filter(...videos: Buffer[]) {
    return new FilterFile(...videos).video();
  }

  static async fromFile(...path: string[]) {
    const buffer = await AV.loadFile(path);
    return Video.new(buffer);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await AV.loadUrl(url);
    return Video.new(buffer);
  }

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
