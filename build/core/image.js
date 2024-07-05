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
    constructor(...images) {
        super();
        this.images = images;
    }
    get length() {
        return this.images.length;
    }
    getImages() {
        return [...this.images];
    }
    setImages(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield Promise.all(this.images.map((image, index) => __awaiter(this, void 0, void 0, function* () { return callback(image, index); })));
            const filteredImages = images.filter((image) => Buffer.isBuffer(image) && image.length > 0);
            const validImages = yield Image.filter(...filteredImages);
            this.images = validImages;
            return this.length;
        });
    }
    append(...images) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredImages = yield Image.filter(...images);
            this.images.push(...filteredImages);
            return this.length;
        });
    }
    extend(...images) {
        images.forEach((image) => {
            this.images.push(...image.getImages());
        });
        return this.length;
    }
    clone() {
        return new Image(...this.images);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.images = yield Image.filter(...this.images);
            return this.length;
        });
    }
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.images.map((image) => Image.newSharp(image).metadata()));
        });
    }
    /**
     * Add watermark to image
     */
    watermark(logo, options) {
        return __awaiter(this, void 0, void 0, function* () {
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
     * Convert image to another format
     */
    convert(format, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.images.map((image) => Image.newSharp(image).toFormat(format, options).toBuffer({
                resolveWithObject: true,
            })));
        });
    }
    /**
     * Custom image processing
     */
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.images.map((image, index) => __awaiter(this, void 0, void 0, function* () { return callback(Image.newSharp(image), index); })));
        });
    }
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
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return Image.new(buffer);
        });
    }
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return Image.new(buffer);
        });
    }
    /**
     * new Instance of sharp
     */
    static newSharp(image, options) {
        return sharp(image, options).clone();
    }
    static new(images) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtered = yield Image.filter(...images);
            if (filtered.length === 0)
                throw new Error(`${Image.name}: Non valid image`);
            return new Image(...filtered);
        });
    }
}
//# sourceMappingURL=image.js.map