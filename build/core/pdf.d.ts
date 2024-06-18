/// <reference types="node" resolution-mode="require"/>
import type { CreateOptions, LoadOptions, SaveOptions } from "pdf-lib";
import type { PdfCustomDocumentCallback, PDFSetCallback } from "../types/index.js";
import { PDFDocument } from "pdf-lib";
import Core from "./core.js";
export default class PDF extends Core {
    private pdfs;
    constructor(...pdfs: Buffer[]);
    getPdfs(): Buffer[];
    setPdfs<T>(callback: PDFSetCallback<T>): Promise<void>;
    append(...pdfs: Buffer[]): Promise<void>;
    extend(...pdfs: PDF[]): void;
    clone(): PDF;
    filter(): Promise<number>;
    getDocuments(options?: LoadOptions): Promise<PDFDocument[]>;
    metadata(options?: LoadOptions): Promise<{
        title: string | undefined;
        author: string | undefined;
        subject: string | undefined;
        creator: string | undefined;
        keywords: string | undefined;
        producer: string | undefined;
        pageCount: number;
        pageIndices: number[];
        creationDate: Date | undefined;
        modificationDate: Date | undefined;
    }[]>;
    getPages(options?: LoadOptions): Promise<import("pdf-lib").PDFPage[][]>;
    getForm(options?: LoadOptions): Promise<import("pdf-lib").PDFForm[]>;
    custom<T>(callback: PdfCustomDocumentCallback<T>, options?: LoadOptions): Promise<Awaited<T>[]>;
    static fromFile(...path: string[]): Promise<PDF>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<PDF>;
    /**
     * Convert url to pdf
     */
    /**
     * Convert html string to pdf
     */
    static filter(...pdfs: Buffer[]): Promise<Buffer[]>;
    static save<T extends PDFDocument>(pdfs: T, options?: SaveOptions): Promise<Uint8Array>;
    static save<T extends PDFDocument[]>(pdfs: T, options?: SaveOptions): Promise<Uint8Array[]>;
    static load<T extends string | Uint8Array | ArrayBuffer>(pdf: T, options?: LoadOptions): Promise<PDFDocument>;
    static create(options?: CreateOptions): Promise<PDFDocument>;
    static document(): typeof PDFDocument;
}
//# sourceMappingURL=pdf.d.ts.map