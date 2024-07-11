/// <reference types="node" resolution-mode="require"/>
import type { FileTypeResult, MimeType, FileExtension } from "file-type";
import type { InputFiles } from "../types/index.js";
/**
 * Easy and fast way to filter bunche of files
 */
export default class FilterFile {
    private readonly input;
    constructor(...input: InputFiles[]);
    application(): Promise<Buffer[]>;
    audio(): Promise<Buffer[]>;
    font(): Promise<Buffer[]>;
    image(): Promise<Buffer[]>;
    model(): Promise<Buffer[]>;
    text(): Promise<Buffer[]>;
    video(): Promise<Buffer[]>;
    /**
     * Filter custom file
     * @param me - mime extension
     */
    custom(me: string): Promise<Buffer[]>;
    static filter(...input: InputFiles[]): Promise<Record<"applications" | "audios" | "fonts" | "images" | "models" | "texts" | "videos", Buffer[]>>;
    static type<T extends InputFiles>(files: T): Promise<FileTypeResult | undefined>;
    static type<T extends InputFiles[]>(files: T): Promise<(FileTypeResult | undefined)[]>;
    static mime<T extends InputFiles>(files: T): Promise<MimeType | undefined>;
    static mime<T extends InputFiles[]>(files: T): Promise<(MimeType | undefined)[]>;
    static extension<T extends InputFiles>(files: T): Promise<FileExtension | undefined>;
    static extension<T extends InputFiles[]>(files: T): Promise<(FileExtension | undefined)[]>;
}
//# sourceMappingURL=filter.d.ts.map