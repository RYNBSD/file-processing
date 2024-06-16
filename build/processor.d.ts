/// <reference types="node" resolution-mode="require"/>
import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";
export default class Processor {
    private readonly files;
    constructor(...files: Buffer[]);
    /**
     *
     * @param check Check if provided files are images @default false
     * @returns - Image instance
     */
    image(check?: boolean): Promise<Image>;
    /**
     *
     * @param check Check if provided files are pdfs @default false
     * @returns - PDF instance
     */
    pdf(check?: boolean): Promise<PDF>;
    /**
     *
     * @param check Check if provided files are csvs @default false
     * @returns - CSV instance
     */
    csv(check?: boolean): Promise<CSV>;
    /**
     *
     * @param check Check if provided files are texts @default false
     * @returns - Text instance
     */
    text(check?: boolean): Promise<Text>;
    /**
     *
     * @param check Check if provided files are videos @default false
     * @returns - Text instance
     */
    video(check?: boolean): Promise<Video>;
    /**
     *
     * @param check Check if provided files are audios @default false
     * @returns - Text instance
     */
    audio(check?: boolean): Promise<Audio>;
}
//# sourceMappingURL=processor.d.ts.map