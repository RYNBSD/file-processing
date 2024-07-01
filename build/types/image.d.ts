/// <reference types="node" resolution-mode="require"/>
import type { Sharp, AvailableFormatInfo, AvifOptions, FormatEnum, GifOptions, HeifOptions, Jp2Options, JpegOptions, JxlOptions, OutputOptions, PngOptions, TiffOptions, WebpOptions, Blend, ResizeOptions } from "sharp";
export type ImageFormats = keyof FormatEnum | AvailableFormatInfo;
export type ImageOptions<F extends ImageFormats> = F extends "jpeg" ? JpegOptions : F extends "png" ? PngOptions : F extends "webp" ? WebpOptions : F extends "avif" ? AvifOptions : F extends "heif" ? HeifOptions : F extends "jxl" ? JxlOptions : F extends "gif" ? GifOptions : F extends "jp2" ? Jp2Options : F extends "tiff" ? TiffOptions : OutputOptions;
export type ImageWatermarkOptions = {
    /**
     * Resize logo
     */
    resize?: ResizeOptions;
    /**
     * Where is the logo position ?
     * @default center
     */
    gravity?: "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest" | "center" | (string & {}) | number;
    /**
     * Between 0 - 1
     * @default 0.5
     */
    alpha?: number;
    /**
     * repeat image
     * @default false
     */
    tile?: boolean;
    /**
     * @default over
     */
    blend?: Blend;
    premultiplied?: boolean;
};
export type ImageSetCallback<T> = (image: Buffer, index: number) => Promise<T> | T;
export type ImageCustomCallback<T> = (sharp: Sharp, index: number) => Promise<T> | T;
//# sourceMappingURL=image.d.ts.map