var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FilterFile } from "../helper/index.js";
import sharp from "sharp";
import Core from "./core.js";
export default class Image extends Core {
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
    constructor(...images) {
        super();
        this.images = images;
    }
    /** get current length of images */
    get length() {
        return this.images.length;
    }
    /**
     * get images of this instance
     *
     * @example
     * ```js
     *  const buffer = await Image.loadFile("image.png")
     *
     *  // not the same reference
     *  const images = new Image(buffer).getImages()
     *  // => 1
     * ```
     */
    getImages() {
        return [...this.images];
    }
    /**
     * set images
     *
     * @returns - new length
     *
     * @example
     * ```js
     *  const image = await Image.fromFile("image.png")
     *
     *  // this method filter invalid images after set, the callback could be async
     *  const newLength = await image.setImages((image, index) => {
     *    return index % 2 ? image : image.toString()
     *  })
     *  // => 0
     * ```
     */
    setImages(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield Promise.all(this.images.map((image, index) => __awaiter(this, void 0, void 0, function* () { return callback(image, index); })));
            const filteredImages = images.filter((image) => Buffer.isBuffer(image) && image.length > 0);
            const validImages = yield Image.filter(...filteredImages);
            this.images = validImages;
            return this.length;
        });
    }
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
    append(...images) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredImages = yield Image.filter(...images);
            this.images.push(...filteredImages);
            return this.length;
        });
    }
    /**
     *
     * @param images - extend images from instance to another
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
    extend(...images) {
        images.forEach((image) => {
            this.images.push(...image.getImages());
        });
        return this.length;
    }
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
    clone() {
        return new Image(...this.images);
    }
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
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.images = yield Image.filter(...this.images);
            return this.length;
        });
    }
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
     * */
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.images.map((image) => Image.newSharp(image).metadata()));
        });
    }
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
    watermark(logo_1) {
        return __awaiter(this, arguments, void 0, function* (logo, options = {}) {
            const { resize, gravity = "center", alpha = 0.5, tile = false, blend = "over", premultiplied } = options;
            const buffer = yield Core.toBuffer(logo);
            const input = yield Image.newSharp(buffer)
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
            return Promise.all(this.images.map((image) => Image.newSharp(image)
                .composite([{ input, gravity, blend, tile, premultiplied }])
                .toBuffer({ resolveWithObject: true })));
        });
    }
    /**
     * @returns - converted images
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
     * */
    convert(format, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.images.map((image) => Image.newSharp(image).toFormat(format, options).toBuffer({
                resolveWithObject: true,
            })));
        });
    }
    /**
     * @returns - base on the callback return type
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
     * */
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.images.map((image, index) => __awaiter(this, void 0, void 0, function* () { return callback(Image.newSharp(image), index); })));
        });
    }
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
    static filter(...images) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...images).image();
        });
    }
    static justBuffer(rtn) {
        if (Array.isArray(rtn))
            return rtn.map((r) => Image.justBuffer(r));
        return rtn.data;
    }
    static screenshot(urls, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(urls))
                return Promise.all(urls.map((url) => __awaiter(this, void 0, void 0, function* () { return Image.screenshot(url, options); })));
            const browser = yield Core.initBrowser();
            const page = yield browser.newPage();
            const res = yield page.goto(urls, { waitUntil: "networkidle2" });
            if (res === null || !res.ok())
                throw new Error(`${Image.name}: Can't fetch (${urls})`);
            const buffer = yield page.screenshot(options);
            yield browser.close();
            return buffer;
        });
    }
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
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return Image.new(buffer);
        });
    }
    /**
     * @throws
     *
     * load images from urls
     * @returns - loaded urls
     *
     * @example
     * ```js
     *  const image = await Image.fromUrl("image.png")
     *  // => Image
     *
     *  const image = await Image.fromUrl("image.png", "text.txt")
     *  // => Image
     *  const length = image.length
     *  // => 1
     *
     *  const text = await Image.fromUrl("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return Image.new(buffer);
        });
    }
    /**
     * @returns - new instance of sharp
     *
     * @example
     * ```js
     *  const sharp = Image.newSharp("image.png")
     *  // => Sharp
     * ```
     */
    static newSharp(image, options) {
        return sharp(image, options).clone();
    }
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
    static new(images) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtered = yield Image.filter(...images);
            if (filtered.length === 0)
                throw new Error(`${Image.name}: Non valid image`);
            return new Image(...filtered);
        });
    }
    /**
     * check if an object is instance of Image or not
     * @returns - boolean
     *
     * @example
     * ```js
     *  const image = new Image()
     *   const isImage = Image.isImage(image)
     *  // => true
     *
     *  const object = new Object()
     *  const isNotImage = Image.isImage(object)
     *  // => false
     * ```
     */
    static isImage(obj) {
        return obj instanceof Image;
    }
}
//# sourceMappingURL=image.js.map