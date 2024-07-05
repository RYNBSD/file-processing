import type { AVSetCallback } from "../../types/index.js";
import { FilterFile } from "../../helper/index.js";
import Core from "../core.js";
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

  static async filter(...videos: Buffer[]) {
    return new FilterFile(...videos).video();
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    return Video.new(buffer);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    return Video.new(buffer);
  }

  static async new(videos: Buffer[]) {
    const filtered = await Video.filter(...videos);
    if (filtered.length === 0) throw new Error(`${Video.name}: Non valid video`);
    return new Video(...filtered);
  }

  static isVideo(obj: unknown): obj is Video {
    return obj instanceof Video;
  }
}
