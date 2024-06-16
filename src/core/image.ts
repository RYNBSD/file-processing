import type {
  ImageCustomCallback,
  ImageFormats,
  ImageOptions,
  ImageSetCallback,
} from "../types/index.js";
import { FilterFile } from "../helper/index.js";
import sharp from "sharp";
import Core from "./core.js";

export default class Image extends Core {
  private images: Buffer[];
  constructor(...images: Buffer[]) {
    super();
    this.images = images;
  }

  getImages() {
    return [...this.images];
  }

  async setImages<T>(callback: ImageSetCallback<T>) {
    const images = await Promise.all(
      this.images.map((image, index) => callback(image, index))
    );
    const filteredImages = images.filter((image) =>
      Buffer.isBuffer(image)
    ) as Buffer[];
    this.images = filteredImages;
  }

  async appendImages(...images: Buffer[]) {
    const filteredImages = await Image.filter(...images);
    this.images.push(...filteredImages);
  }

  extendImages(...images: Image[]) {
    images.forEach((image) => {
      this.images.push(...image.getImages());
    });
  }

  override clone() {
    return new Image(...this.images);
  }

  override async filter() {
    this.images = await Image.filter(...this.images);
    return this.images.length;
  }

  override async check() {
    const images = await Image.filter(...this.images);
    if (images.length === 0)
      throw new TypeError(`${Image.name}: Files must be of type image`);
  }

  override async metadata() {
    return Promise.all(
      this.images.map((image) => Image.newSharp(image).metadata())
    );
  }

  /**
   * Convert image to another format
   */
  async convert<F extends ImageFormats>(format: F, options?: ImageOptions<F>) {
    return Promise.all(
      this.images.map((image) =>
        Image.newSharp(image).toFormat(format, options).toBuffer({
          resolveWithObject: true,
        })
      )
    );
  }

  /**
   * Custom image processing
   */
  async custom<T>(callback: ImageCustomCallback<T>): Promise<Awaited<T>[]> {
    return Promise.all(
      this.images.map((image, index) => callback(Image.newSharp(image), index))
    );
  }

  static async filter(...images: Buffer[]) {
    return new FilterFile(...images).image();
  }

  static async fromFile(path: string) {
    const buffer = await Core.loadFile(path);
    return new Image(buffer);
  }

  static async fromUrl<T extends string | URL>(url: T) {
    const buffer = await Core.loadUrl(url);
    return new Image(buffer);
  }

  /**
   * new Instance of sharp
   */
  static newSharp<T extends Buffer | string | undefined = undefined>(
    image?: T,
    options?: sharp.SharpOptions
  ) {
    return sharp(image, options).clone();
  }
}
