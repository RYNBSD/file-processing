/// <reference types="node" resolution-mode="require"/>
import type { ScreenshotOptions } from "puppeteer";
import type { ImageCustomCallback, ImageFormats, ImageOptions, ImageSetCallback, ImageWatermarkOptions, InputFiles } from "../types/index.js";
import sharp from "sharp";
import Core from "./core.js";
export default class Image extends Core {
    private images;
    /**
     * Create unsafe instance
     *
     * to create safe instance:
     * ```js
     *  const imageFile = await Image.loadFile("image.png")
     *
     *  // create safe new instance
     *  const image = Image.new(imageFile)
     *  // => Image
     * ```
     */
    constructor(...images: Buffer[]);
    /** get current length of images */
    get length(): number;
    /**
     * get images of this instance
     *
     * @example
     * ```js
     *  const buffer = await Image.loadFile("image.png")
     *
     *  // not the same reference
     *  const images = new Image(buffer).getImages()
     *  // => Buffer[]
     * ```
     */
    getImages(): Buffer[];
    /**
     * set images
     *
     * @returns - new length
     *
     * @example
     * ```js
     *  const image = await Image.fromFile("image.png")
     *
     *  // this method filter invalid images before set
     *  const newLength = await image.setImages(\* async *\(image, index) => {
     *    return index % 2 ? image : image.toString()
     *  })
     *  // => 0
     * ```
     */
    setImages<T>(callback: ImageSetCallback<T>): Promise<number>;
    /**
     *
     * @param images - new images (Buffer) to append the exists list
     * @returns - new length
     *
     * @example
     * ```js
     *  const image = new Image()
     *  const buffer1 = await Image.loadFile("image1.png")
     *  const buffer2 = await Image.loadFile("image2.png")
     *
     *  // filter invalid images
     *  await image.append(buffer1, Buffer.alloc(1), buffer2)
     *  // => 2
     * ```
     */
    append(...images: Buffer[]): Promise<number>;
    /**
     *
     * @param images - extend images from instance to an another
     * @returns - new length
     *
     * @example
     * ```js
     *  const buffer1 = await Image.loadFile("image1.png")
     *  const buffer2 = await Image.loadFile("image2.png")
     *  const image1 = new Image(buffer1, buffer2)
     *
     *  const image2 = new Image()
     *
     *  // don't apply any filters
     *  image2.extend(image1)
     *  // => 2
     * ```
     */
    extend(...images: Image[]): number;
    /**
     *
     * @returns - clone current instance
     *
     * @example
     * ```js
     *  const image = new Image()
     *
     *  // not the same reference
     *  const clone = image.clone()
     *  // => Image
     * ```
     */
    clone(): Image;
    /**
     * Clean images array, to free memory
     *
     * @example
     * ```js
     *  const image = await Image.fromFile("image1.png", "image2.webp")
     *
     *  // Some operations
     *
     *  image.clean()
     *
     *  // Some operations
     *
     *  image.append(Buffer.alloc(1))
     * ```
     */
    clean(): void;
    /**
     * filter images
     * @returns - new length
     *
     * @example
     * ```js
     *  const image = new Image(Buffer.alloc(1))
     *  await image.filter()
     *  // => 0
     * ```
     */
    filter(): Promise<number>;
    /**
     * @returns - images metadata
     *
     * @example
     * ```js
     *  const image1 = await Image.loadFile("image1.png")
     *  const image2 = await Image.loadFile("image2.png")
     *
     *  const image = new Image(image1, image2)
     *  const metadata = await image.metadata()
     *  // => Metadata[]
     * ```
     */
    metadata(): Promise<sharp.Metadata[]>;
    /**
     * Add watermark to images
     *
     * const logo = "logo.png" // or any supported input type
     *
     * const image1 = await Image.loadFile("image1.png")
     * const image2 = await Image.loadFile("image2.png")
     * const image = new Image(image1, image2)
     *
     * const watermark = await image.watermark(logo)
     * // => { data: Buffer; info: sharp.OutputInfo; }[]
     */
    watermark(logo: InputFiles, options?: ImageWatermarkOptions): Promise<{
        data: Buffer;
        info: sharp.OutputInfo;
    }[]>;
    /**
     * @returns converted images
     *
     * @example
     * ```js
     *  const image1 = await Image.loadFile("image1.png")
     *  const image2 = await Image.loadFile("image2.png")
     *
     *  const image = new Image(image1, image2)
     *  const buffers = await image.convert("webp")
     *  // => { data: Buffer; info: sharp.OutputInfo; }[]
     * ```
     */
    convert<F extends ImageFormats>(format: F, options?: ImageOptions<F>): Promise<{
        data: Buffer;
        info: sharp.OutputInfo;
    }[]>;
    /**
     * supported images format @link https://github.com/naptha/tesseract.js/blob/master/docs/image-format.md
     *
     * @param langs - languages @link https://github.com/naptha/tesseract.js/blob/master/src/constants/languages.js
     *
     * @example
     * ```js
     *  const image1 = await Image.loadFile("image1.png")
     *  const image2 = await Image.loadFile("image2.png")
     *
     *  const image = new Image(image1, image2)
     *  const ocrs = await image.ocr(["ara", "eng"])
     *  // => Tesseract.Page[]
     * ```
     */
    ocr(langs: string | string[]): Promise<import("tesseract.js").Page[]>;
    /**
     * @returns base on the callback return type
     *
     * @example
     * ```js
     *  const image1 = await Image.loadFile("image1.png")
     *  const image2 = await Image.loadFile("image2.png")
     *
     *  const image = new Image(image1, image2)
     *
     *  await image.custom(\* async *\(sharp, _index) => {
     *    return sharp.resize({ width: 1280, height: 720, fit: "fill" }).blur().toBuffer()
     *  })
     *  // => Buffer[]
     *
     *  await image.custom(\* async *\(_sharp, index) => {
     *    return index
     *  })
     *  // => number[]
     * ```
     */
    custom<T>(callback: ImageCustomCallback<T>): Promise<Awaited<T>[]>;
    /**
     *
     * @returns - filter non image
     *
     * @example
     * ```js
     *  const image1 = await Image.loadFile("image1.png")
     *  const image2 = await Image.loadFile("image2.png")
     *
     *  const buffer = await Image.filter(image1, image2)
     *  // => Buffer[]
     * ```
     */
    static filter(...images: Buffer[]): Promise<Buffer[]>;
    /**
     *
     * @returns - Extract buffer from return methods
     *
     * @example
     * ```js
     *  const image1 = await Image.loadFile("image1.png")
     *  const image2 = await Image.loadFile("image2.png")
     *
     *  const image = new Image(image1, image2)
     *  const converted = await image.convert("webp")
     *  // => { data: Buffer; info: sharp.OutputInfo; }[]
     *
     *  const buffers = Image.justBuffer(converted)
     *  // => Buffer[]
     * ```
     * */
    static justBuffer(rtn: {
        data: Buffer;
        info: sharp.OutputInfo;
    }): Buffer;
    static justBuffer(rtn: {
        data: Buffer;
        info: sharp.OutputInfo;
    }[]): Buffer[];
    /**
     * @deprecated
     * @returns - Take screenshot of websites
     *
     * @example
     * ```js
     *  const image = awaitImage.screenshot("https://example.com")
     *  // Buffer
     *
     *  const images = awaitImage.screenshot(["https://example.com", "https://example.net"])
     *  // Buffer[]
     * ```
     * */
    static screenshot<T extends string>(urls: T, options?: Omit<ScreenshotOptions, "encoding">): Promise<Buffer>;
    static screenshot<T extends string[]>(urls: T, options?: Omit<ScreenshotOptions, "encoding">): Promise<Buffer[]>;
    /**
     * @throws
     *
     * load images from files
     * @returns - loaded files
     *
     * @example
     * ```js
     *  const image = await Image.fromFile("image.png")
     *  // => Image
     *
     *  const image = await Image.fromFile("image.png", "text.txt")
     *  // => Image
     *  const length = image.length
     *  // => 1
     *
     *  const text = await Image.fromFile("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromFile(...path: string[]): Promise<Image>;
    /**
     * @throws
     *
     * load images from urls
     * @returns - loaded urls
     *
     * @example
     * ```js
     *  const image = await Image.fromUrl("http://example.com/image.png")
     *  // => Image
     *
     *  const image = await Image.fromUrl("http://example.com/image.png", "http://example.com/text.txt")
     *  // => Image
     *  const length = image.length
     *  // => 1
     *
     *  const text = await Image.fromUrl("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Image>;
    /**
     * @returns - new instance of sharp
     *
     * @example
     * ```js
     *  const sharp = Image.newSharp("image.png")
     *  // => Sharp
     * ```
     */
    static newSharp<T extends Buffer | string | undefined = undefined>(image?: T, options?: sharp.SharpOptions): sharp.Sharp;
    /**
     * @throws
     *
     * @param images - images buffer
     * @returns - create new safe instance
     *
     * @example
     * ```js
     *  const image = await Image.new(Buffer.alloc(1))
     *  // => Error (throw)
     *
     *  const imageFile = await Image.loadFile("image.png")
     *
     *  // filter non image
     *  const image = await Image.new(imageFile, Buffer.alloc(1))
     *  // => Image
     *  const length = image.length
     *  // => 1
     * ```
     */
    static new(images: Buffer[]): Promise<Image>;
    /**
     * check if an object is instance of Image or not
     * @returns - boolean
     *
     * @example
     * ```js
     *  const image = new Image()
     *  const isImage = Image.isImage(image)
     *  // => true
     *
     *  const object = new Object()
     *  const isNotImage = Image.isImage(object)
     *  // => false
     * ```
     */
    static isImage(obj: unknown): obj is Image;
}
//# sourceMappingURL=image.d.ts.map