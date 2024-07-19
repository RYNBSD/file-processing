import type { AVSetCallback } from "../../types/index.js";
import { FilterFile, loader } from "../../helper/index.js";
import AV from "./av.js";

export default class Audio extends AV {
  constructor(...audios: Buffer[]) {
    super(...audios);
  }

  /**
   * get avs of this instance
   *
   * @example
   * ```js
   *  const buffer = await Audio.loadFile("av.mp3")
   *
   *  // not the same reference
   *  const avs = new Audio(buffer).getAudios()
   *  // => Buffer[]
   * ```
   */
  getAudios() {
    return [...this.avs];
  }

  /**
   * set audios
   *
   * @returns - new length
   *
   * @example
   * ```js
   *  const audio = await Audio.fromFile("audio.mp3")
   *
   *  // this method filter invalid audios before set
   *  const newLength = await audio.setAudios(\* async *\(audio, index) => {
   *    return index % 2 ? audio : audio.toString()
   *  })
   *  // => 0
   * ```
   */
  async setAudios<T>(callback: AVSetCallback<T>) {
    const audios = await Promise.all(this.avs.map(async (audio, index) => callback(audio, index)));
    const filteredAudios = audios.filter((audio) => Buffer.isBuffer(audio) && audio.length > 0) as Buffer[];
    const validAudios = await Audio.filter(...filteredAudios);
    this.avs = validAudios;
    return this.length;
  }

  /**
   *
   * @param audios - new audios (Buffer) to append the exists list
   * @returns - new length
   *
   * @example
   * ```js
   *  const audio = new Audio()
   *  const buffer1 = await Audio.loadFile("audio1.mp3")
   *  const buffer2 = await Audio.loadFile("audio2.mp3")
   *
   *  // filter invalid audios
   *  await audio.append(buffer1, Buffer.alloc(1), buffer2)
   *  // => 2
   * ```
   */
  override async append(...audios: Buffer[]) {
    const filteredAudios = await Audio.filter(...audios);
    this.avs.push(...filteredAudios);
    return this.length;
  }

  /**
   *
   * @param audios - extend audios from instance to an another
   * @returns - new length
   *
   * @example
   * ```js
   *  const buffer1 = await Audio.loadFile("audio1.mp3")
   *  const buffer2 = await Audio.loadFile("audio2.mp3")
   *  const audio1 = new Audio(buffer1, buffer2)
   *
   *  const audio2 = new Audio()
   *
   *  // don't apply any filters
   *  audio2.extend(audio1)
   *  // => 2
   * ```
   */
  override extend(...audios: Audio[]) {
    audios.forEach((audio) => {
      this.avs.push(...audio.getAudios());
    });
    return this.length;
  }

  /**
   *
   * @returns - clone current instance
   *
   * @example
   * ```js
   *  const audio = new Audio()
   *
   *  // not the same reference
   *  const clone = audio.clone()
   *  // => Audio
   * ```
   */
  override clone() {
    return new Audio(...this.avs);
  }

  /**
   * filter audios
   * @returns - new length
   *
   * @example
   * ```js
   *  const audio = new Audio(Buffer.alloc(1))
   *  await audio.filter()
   *  // => 0
   * ```
   */
  override async filter() {
    this.avs = await Audio.filter(...this.avs);
    return this.length;
  }

  /**
   *
   * @returns - filter non audio
   *
   * @example
   * ```js
   *  const audio1 = await Audio.loadFile("audio1.mp3")
   *  const audio2 = await Audio.loadFile("audio2.mp3")
   *
   *  const buffer = await Audio.filter(audio1, audio2)
   *  // => Buffer[]
   * ```
   */
  static filter(...audios: Buffer[]) {
    return new FilterFile(...audios).audio();
  }

  /**
   * @throws
   *
   * load audios from files
   * @returns - loaded files
   *
   * @example
   * ```js
   *  const audio = await Audio.fromFile("audio.mp3")
   *  // => Audio
   *
   *  const audio = await Audio.fromFile("audio.mp3", "text.txt")
   *  // => Audio
   *  const length = audio.length
   *  // => 1
   *
   *  const text = await Audio.fromFile("text.txt")
   *  // => Error (throw)
   * ```
   */
  static async fromFile(...path: string[]) {
    const buffer = await loader.loadFile(path);
    return Audio.new(buffer);
  }

  /**
   * @throws
   *
   * load audios from urls
   * @returns - loaded urls
   *
   * @example
   * ```js
   *  const audio = await Audio.fromUrl("http://example.com/audio.mp3")
   *  // => Audio
   *
   *  const audio = await Audio.fromUrl("http://example.com/audio.mp3", "http://example.com/text.txt")
   *  // => Audio
   *  const length = audio.length
   *  // => 1
   *
   *  const text = await Audio.fromUrl("text.txt")
   *  // => Error (throw)
   * ```
   */
  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await loader.loadUrl(url);
    return Audio.new(buffer);
  }

  /**
   * @throws
   *
   * @param audios - audios buffer
   * @returns - create new safe instance
   *
   * @example
   * ```js
   *  const audio = await Audio.new(Buffer.alloc(1))
   *  // => Error (throw)
   *
   *  const audioFile = await Audio.loadFile("audio.mp3")
   *
   *  // filter non audio
   *  const audio = await Audio.new(audioFile, Buffer.alloc(1))
   *  // => Audio
   *  const length = audio.length
   *  // => 1
   * ```
   */
  static async new(audios: Buffer[]) {
    const filtered = await Audio.filter(...audios);
    if (filtered.length === 0) throw new Error(`${Audio.name}: Non valid audio`);
    return new Audio(...filtered);
  }

  /**
   * check if an object is instance of Audio or not
   * @returns - boolean
   *
   * @example
   * ```js
   *  const audio = new Audio()
   *  const isAudio = Audio.isAudio(audio)
   *  // => true
   *
   *  const object = new Object()
   *  const isNotAudio = Audio.isAudio(object)
   *  // => false
   * ```
   */
  static isAudio(obj: unknown): obj is Audio {
    return obj instanceof Audio;
  }
}
