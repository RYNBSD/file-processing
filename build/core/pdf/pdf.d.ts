/// <reference types="node" resolution-mode="require"/>
import type { PDFOptions } from "puppeteer";
import type { CreateOptions, LoadOptions, SaveOptions } from "pdf-lib";
import type { PdfCustomDocumentCallback, PDFFromImageOptions, PDFMergeOptions, PDFSetCallback } from "../../types/index.js";
import { PDFDocument } from "pdf-lib";
import Core from "../core.js";
export default class PDF extends Core {
    private pdfs;
    constructor(...pdfs: Buffer[]);
    /** get current length of pdfs */
    get length(): number;
    /**
     * get pdfs of this instance
     *
     * @example
     * ```js
     *  const buffer = await PDF.loadFile("pdf.pdf")
     *
     *  // not the same reference
     *  const pdfs = new PDF(buffer).getPdfs()
     *  // => Buffer[]
     * ```
     */
    getPdfs(): Buffer[];
    /**
     * set pdfs
     *
     * @returns - new length
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf.pdf")
     *
     *  // this method filter invalid pdfs before set
     *  const newLength = await pdf.setPdfs(\* async *\(pdf, index) => {
     *    return index % 2 ? pdf : pdf.toString()
     *  })
     *  // => 0
     * ```
     */
    setPdfs<T>(callback: PDFSetCallback<T>): Promise<number>;
    /**
     *
     * @param pdfs - new pdfs (Buffer) to append the exists list
     * @returns - new length
     *
     * @example
     * ```js
     *  const pdf = new PDF()
     *  const buffer1 = await PDF.loadFile("pdf1.pdf")
     *  const buffer2 = await PDF.loadFile("pdf2.pdf")
     *
     *  // filter invalid pdfs
     *  await pdf.append(buffer1, Buffer.alloc(1), buffer2)
     *  // => 2
     * ```
     */
    append(...pdfs: Buffer[]): Promise<number>;
    /**
     *
     * @param pdfs - extend pdfs from instance to an another
     * @returns - new length
     *
     * @example
     * ```js
     *  const buffer1 = await PDF.loadFile("pdf1.pdf")
     *  const buffer2 = await PDF.loadFile("pdf2.pdf")
     *  const pdf1 = new PDF(buffer1, buffer2)
     *
     *  const pdf2 = new PDF()
     *
     *  // don't apply any filters
     *  pdf2.extend(pdf1)
     *  // => 2
     * ```
     */
    extend(...pdfs: PDF[]): number;
    /**
     *
     * @returns - clone current instance
     *
     * @example
     * ```js
     *  const pdf = new PDF()
     *
     *  // not the same reference
     *  const clone = pdf.clone()
     *  // => PDF
     * ```
     */
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
    /**
     * filter pdfs
     * @returns - new length
     *
     * @example
     * ```js
     *  const pdf = new PDF(Buffer.alloc(1))
     *  await pdf.filter()
     *  // => 0
     * ```
     */
    filter(): Promise<number>;
    /**
     *
     * @param options load options
     * @returns pdf document
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf1.pdf", "pdf2.pdf")
     *  const documents = await pdf.getDocuments()
     *  // => PDFDocument[]
     * ```
     */
    getDocuments(options?: LoadOptions): Promise<PDFDocument[]>;
    /**
     * @returns pdfs metadata
     *
     * @example
     * ```js
     *  const pdf1 = await PDF.loadFile("pdf1.pdf")
     *  const pdf2 = await PDF.loadFile("pdf2.pdf")
     *
     *  const pdf = new PDF(pdf1, pdf2)
     *  const metadata = await pdf.metadata()
     *  // => Metadata[]
     * ```
     */
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
    /**
     *
     * @param options load options
     * @returns pdf pages
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf1.pdf", "pdf2.pdf")
     *  const pages = await pdf.getPages()
     *  // => PDFPage[][]
     * ```
     */
    getPages(options?: LoadOptions): Promise<import("pdf-lib").PDFPage[][]>;
    /**
     *
     * @param options load options
     * @returns pdf form
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf1.pdf", "pdf2.pdf")
     *  const pages = await pdf.getForm()
     *  // => PDFForm[]
     * ```
     */
    getForm(options?: LoadOptions): Promise<import("pdf-lib").PDFForm[]>;
    /**
     * merge all pdfs in one pdf
     * @param options merge options
     * @returns merged pdf
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf1.pdf", "pdf2.pdf")
     *  const merge = await pdf.merge()
     *  // => Buffer
     * ```
     */
    merge(options?: PDFMergeOptions): Promise<Buffer>;
    /**
     *
     * @param options load options
     * @returns base on what your callback return
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf1.pdf", "pdf2.pdf")
     *
     *  await pdf.custom((document, _index) => {
     *    return PDF.save(document)
     *  })
     *  // => Buffer[]
     *
     *  await pdf.custom((_document, index) => index)
     *  // => number[]
     * ```
     */
    custom<T>(callback: PdfCustomDocumentCallback<T>, options?: LoadOptions): Promise<Awaited<T>[]>;
    /**
     * @throws
     *
     * load pdfs from files
     * @returns - loaded files
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf.pdf")
     *  // => PDF
     *
     *  const pdf = await PDF.fromFile("pdf.pdf", "text.txt")
     *  // => PDF
     *  const length = pdf.length
     *  // => 1
     *
     *  const text = await PDF.fromFile("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromFile(...path: string[]): Promise<PDF>;
    /**
     * @throws
     *
     * load pdfs from urls
     * @returns - loaded urls
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromUrl("http://example.com/pdf.pdf")
     *  // => PDF
     *
     *  const pdf = await PDF.fromUrl("http://example.com/pdf.pdf", "http://example.com/text.txt")
     *  // => PDF
     *  const length = pdf.length
     *  // => 1
     *
     *  const text = await PDF.fromUrl("text.txt")
     *  // => Error (throw)
     * ```
     */
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<PDF>;
    /**
     * @throws
     *
     * @param images - images buffer
     * @param options - convert options
     *
     * @example
     * ```js
     *  // image buffer
     *  const image = Buffer.alloc(1)
     *  const pdf = await PDF.fromImage(image)
     *  // => PDFDocument | PDFDocument[]
     * ```
     */
    static fromImage<T extends Buffer>(images: T, options?: PDFFromImageOptions): Promise<PDFDocument>;
    static fromImage<T extends Buffer[]>(images: T, options?: PDFFromImageOptions): Promise<PDFDocument[]>;
    /**
     * @deprecated
     * Generate pdf from websites
     */
    static generate<T extends string>(htmls: T, options?: PDFOptions): Promise<Buffer>;
    static generate<T extends string[]>(htmls: T, options?: PDFOptions): Promise<Buffer[]>;
    /**
     *
     * @returns filter non pdf
     *
     * @example
     * ```js
     *  const pdf1 = await PDF.loadFile("pdf1.pdf")
     *  const pdf2 = await PDF.loadFile("pdf2.pdf")
     *  const buffer = await PDF.filter(pdf1, pdf2)
     *  // => Buffer[]
     * ```
     */
    static filter(...pdfs: Buffer[]): Promise<Buffer[]>;
    /**
     *
     * @param pdfs - pdf document
     * @param options - save options
     *
     * @example
     * ```js
     *  const pdf = await PDF.fromFile("pdf.pdf")
     *  const documents = await pdf.getDocuments()
     *  const buffer = await PDF.save(documents)
     *  // => Buffer | Buffer[]
     * ```
     */
    static save<T extends PDFDocument>(pdfs: T, options?: SaveOptions): Promise<Buffer>;
    static save<T extends PDFDocument[]>(pdfs: T, options?: SaveOptions): Promise<Buffer[]>;
    static load<T extends string | Uint8Array | ArrayBuffer>(pdf: T, options?: LoadOptions): Promise<PDFDocument>;
    static create(options?: CreateOptions): Promise<PDFDocument>;
    static document(): typeof PDFDocument;
    /**
     * @throws
     *
     * @param pdfs - pdfs buffer
     * @returns - create new safe instance
     *
     * @example
     * ```js
     *  const pdf = await PDF.new(Buffer.alloc(1))
     *  // => Error (throw)
     *
     *  const pdfFile = await PDF.loadFile("pdf.pdf")
     *
     *  // filter non pdf
     *  const pdf = await PDF.new(pdfFile, Buffer.alloc(1))
     *  // => PDF
     *  const length = pdf.length
     *  // => 1
     * ```
     */
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