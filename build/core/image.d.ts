/// <reference types="node" resolution-mode="require"/>
import type { ScreenshotOptions } from "puppeteer";
import type { ImageCustomCallback, ImageFormats, ImageOptions, ImageSetCallback } from "../types/index.js";
import sharp from "sharp";
import Core from "./core.js";
export default class Image extends Core {
    private images;
    constructor(...images: Buffer[]);
    get length(): number;
    getImages(): Buffer[];
    setImages<T>(callback: ImageSetCallback<T>): Promise<void>;
    append(...images: Buffer[]): Promise<void>;
    extend(...images: Image[]): void;
    clone(): Image;
    filter(): Promise<number>;
    metadata(): Promise<sharp.Metadata[]>;
    /**
     * Convert image to another format
     */
    convert<F extends ImageFormats>(format: F, options?: ImageOptions<F>): Promise<{
        data: Buffer;
        info: sharp.OutputInfo;
    }[]>;
    /**
     * Custom image processing
     */
    custom<T>(callback: ImageCustomCallback<T>): Promise<Awaited<T>[]>;
    static filter(...images: Buffer[]): Promise<Buffer[]>;
    /**
     * Take screenshot from websites
     */
    static screenshot<T extends string>(urls: T, options?: Omit<ScreenshotOptions, "encoding">): Promise<Buffer>;
    static screenshot<T extends string[]>(urls: T, options?: Omit<ScreenshotOptions, "encoding">): Promise<Buffer[]>;
    static fromFile(...path: string[]): Promise<Image>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Image>;
    /**
     * new Instance of sharp
     */
    static newSharp<T extends Buffer | string | undefined = undefined>(image?: T, options?: sharp.SharpOptions): sharp.Sharp;
}
//# sourceMappingURL=image.d.ts.map