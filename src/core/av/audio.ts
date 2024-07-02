import type { AVSetCallback } from "../../types/index.js";
import { FilterFile } from "../../helper/index.js";
import Core from "../core.js";
import AV from "./av.js";

export default class Audio extends AV {
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
    return this.length;
  }

  override extend(...audios: Audio[]) {
    audios.forEach((audio) => {
      this.avs.push(...audio.getAudios());
    });
    return this.length;
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

  static async new(audios: Buffer[]) {
    const filtered = await Audio.filter(...audios);
    if (filtered.length === 0) throw new Error(`${Audio.name}: Non valid audio`);
    return new Audio(...filtered);
  }
}
