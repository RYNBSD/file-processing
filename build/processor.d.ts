/// <reference types="node" resolution-mode="require"/>
import { Image, Text, PDF, CSV, Video, Audio } from "./core/index.js";
export default class Processor {
    private readonly files;
    constructor(...files: Buffer[]);
    image(): Promise<Image>;
    pdf(): Promise<PDF>;
    csv(): Promise<CSV>;
    text(): Promise<Text>;
    video(): Promise<Video>;
    audio(): Promise<Audio>;
}
//# sourceMappingURL=processor.d.ts.map