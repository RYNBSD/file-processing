/// <reference types="node" resolution-mode="require"/>
import type { PDFOptions } from "puppeteer";
import type { CreateOptions, LoadOptions, SaveOptions } from "pdf-lib";
import type { PdfCustomDocumentCallback, PDFFromImageOptions, PDFMergeOptions, PDFSetCallback } from "../../types/index.js";
import { PDFDocument } from "pdf-lib";
import Core from "../core.js";
export default class PDF extends Core {
    private pdfs;
    constructor(...pdfs: Buffer[]);
    get length(): number;
    getPdfs(): Buffer[];
    setPdfs<T>(callback: PDFSetCallback<T>): Promise<number>;
    append(...pdfs: Buffer[]): Promise<number>;
    extend(...pdfs: PDF[]): number;
    clone(): PDF;
    /**
     * Clean pdfs array, to free memory
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf1.pdf", "pdf2.pdf")
     *
     *  // Some operations
     *
     *  pdf.clean()
     *
     *  // Some operations
     *
     *  pdf.append(Buffer.alloc(1))
     * ```
     */
    clean(): void;
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
    merge(options?: PDFMergeOptions): Promise<PDFDocument>;
    custom<T>(callback: PdfCustomDocumentCallback<T>, options?: LoadOptions): Promise<Awaited<T>[]>;
    static fromFile(...path: string[]): Promise<PDF>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<PDF>;
    /**
     * Convert image to pdf
     * @param images - must be of format png or jpg
     */
    static fromImage<T extends Buffer>(images: T, options?: PDFFromImageOptions): Promise<PDFDocument>;
    static fromImage<T extends Buffer[]>(images: T, options?: PDFFromImageOptions): Promise<PDFDocument[]>;
    /**
     * Generate pdf from websites
     */
    static generate<T extends string>(htmls: T, options?: PDFOptions): Promise<Buffer>;
    static generate<T extends string[]>(htmls: T, options?: PDFOptions): Promise<Buffer[]>;
    static filter(...pdfs: Buffer[]): Promise<Buffer[]>;
    static save<T extends PDFDocument>(pdfs: T, options?: SaveOptions): Promise<Buffer>;
    static save<T extends PDFDocument[]>(pdfs: T, options?: SaveOptions): Promise<Buffer[]>;
    static load<T extends string | Uint8Array | ArrayBuffer>(pdf: T, options?: LoadOptions): Promise<PDFDocument>;
    static create(options?: CreateOptions): Promise<PDFDocument>;
    static document(): typeof PDFDocument;
    static new(pdfs: Buffer[]): Promise<PDF>;
    /**
     * check if an object is instance of PDF or not
     * @returns - boolean
     *
     * @example
     * ```js
     *  const pdf = new PDF()
     *  const isPDF = PDF.isPDF(pdf)
     *  // => true
     *
     *  const object = new Object()
     *  const isNotPDF = PDF.isPDF(object)
     *  // => false
     * ```
     */
    static isPDF(obj: unknown): obj is PDF;
}
//# sourceMappingURL=pdf.d.ts.map