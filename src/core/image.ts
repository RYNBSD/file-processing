import type { ScreenshotOptions } from "puppeteer";
import type {
  ImageCustomCallback,
  ImageFormats,
  ImageOptions,
  ImageSetCallback,
  ImageWatermarkOptions,
  InputFiles,
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

  get length() {
    return this.images.length;
  }

  getImages() {
    return [...this.images];
  }

  async setImages<T>(callback: ImageSetCallback<T>) {
    const images = await Promise.all(this.images.map(async (image, index) => callback(image, index)));
    const filteredImages = images.filter((image) => Buffer.isBuffer(image) && image.length > 0) as Buffer[];
    const validImages = await Image.filter(...filteredImages);
    this.images = validImages;
    return this.length;
  }

  override async append(...images: Buffer[]) {
    const filteredImages = await Image.filter(...images);
    this.images.push(...filteredImages);
  }

  override extend(...images: Image[]) {
    images.forEach((image) => {
      this.images.push(...image.getImages());
    });
  }

  override clone() {
    return new Image(...this.images);
  }

  override async filter() {
    this.images = await Image.filter(...this.images);
    return this.length;
  }

  override async metadata() {
    return Promise.all(this.images.map(async (image) => Image.newSharp(image).metadata()));
  }

  /**
   * Add watermark to image
   */
  async watermark(logo: InputFiles, options: ImageWatermarkOptions) {
    const { resize, gravity = "center", alpha = 0.5, tile = false, blend = "over", premultiplied } = options;

    const buffer = await Core.toBuffer(logo);
    const input = await Image.newSharp(buffer)
      .resize(resize)
      .ensureAlpha(alpha)
      .composite([
        {
          input: Buffer.from([0, 0, 0, Math.round(255 * alpha)]),
          raw: {
            width: 1,
            height: 1,
            channels: 4,
          },
          tile: true,
          blend: "dest-in",
        },
      ])
      .toBuffer();

    return Promise.all(
      this.images.map(async (image) =>
        Image.newSharp(image)
          .composite([{ input, gravity, blend, tile, premultiplied }])
          .toBuffer({ resolveWithObject: true }),
      ),
    );
  }

  /**
   * Convert image to another format
   */
  async convert<F extends ImageFormats>(format: F, options?: ImageOptions<F>) {
    return Promise.all(
      this.images.map(async (image) =>
        Image.newSharp(image).toFormat(format, options).toBuffer({
          resolveWithObject: true,
        }),
      ),
    );
  }

  /**
   * Custom image processing
   */
  async custom<T>(callback: ImageCustomCallback<T>): Promise<Awaited<T>[]> {
    return Promise.all(this.images.map(async (image, index) => callback(Image.newSharp(image), index)));
  }

  static async filter(...images: Buffer[]) {
    return new FilterFile(...images).image();
  }

  /**
   * Extract buffer from return methods
   */
  static justBuffer(rtn: { data: Buffer; info: sharp.OutputInfo }): Buffer;
  static justBuffer(
    rtn: {
      data: Buffer;
      info: sharp.OutputInfo;
    }[],
  ): Buffer[];
  static justBuffer(
    rtn:
      | {
          data: Buffer;
          info: sharp.OutputInfo;
        }[]
      | {
          data: Buffer;
          info: sharp.OutputInfo;
        },
  ) {
    if (Array.isArray(rtn)) return rtn.map((r) => Image.justBuffer(r));
    return rtn.data;
  }

  /**
   * Take screenshot from websites
   */
  static async screenshot<T extends string>(urls: T, options?: Omit<ScreenshotOptions, "encoding">): Promise<Buffer>;
  static async screenshot<T extends string[]>(
    urls: T,
    options?: Omit<ScreenshotOptions, "encoding">,
  ): Promise<Buffer[]>;
  static async screenshot<T extends string | string[]>(urls: T, options?: ScreenshotOptions) {
    if (Array.isArray(urls)) return Promise.all(urls.map(async (url) => Image.screenshot(url, options)));

    const browser = await Core.initBrowser();
    const page = await browser.newPage();

    const res = await page.goto(urls, { waitUntil: "networkidle2" });
    if (res === null || !res.ok()) throw new Error(`${Image.name}: Can't fetch (${urls})`);

    const buffer = await page.screenshot(options);
    await browser.close();
    return buffer;
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    const images = await Image.filter(...buffer);
    return new Image(...images);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    const images = await Image.filter(...buffer);
    return new Image(...images);
  }

  /**
   * new Instance of sharp
   */
  static newSharp<T extends Buffer | string | undefined = undefined>(image?: T, options?: sharp.SharpOptions) {
    return sharp(image, options).clone();
  }
}
