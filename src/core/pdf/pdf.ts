import type { PDFOptions } from "puppeteer";
import type { CreateOptions, LoadOptions, PDFImage, SaveOptions } from "pdf-lib";
import type {
  PdfCustomDocumentCallback,
  PDFFromImageOptions,
  PDFMergeOptions,
  PDFSetCallback,
} from "../../types/index.js";
import { PageSizes, PDFDocument } from "pdf-lib";
import { FilterFile } from "../../helper/index.js";
import Core from "../core.js";

export default class PDF extends Core {
  private pdfs: Buffer[];

  constructor(...pdfs: Buffer[]) {
    super();
    this.pdfs = pdfs;
  }

  /** get current length of pdfs */
  get length() {
    return this.pdfs.length;
  }

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
  getPdfs() {
    return [...this.pdfs];
  }

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
  async setPdfs<T>(callback: PDFSetCallback<T>) {
    const pdfs = await Promise.all(this.pdfs.map(async (pdf, index) => callback(pdf, index)));
    const filteredPdfs = pdfs.filter((pdf) => Buffer.isBuffer(pdf) && pdf.length > 0) as Buffer[];
    const validPdfs = await PDF.filter(...filteredPdfs);
    this.pdfs = validPdfs;
    return this.length;
  }

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
  override async append(...pdfs: Buffer[]) {
    const filteredPdfs = await PDF.filter(...pdfs);
    this.pdfs.push(...filteredPdfs);
    return this.length;
  }

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
  override extend(...pdfs: PDF[]) {
    pdfs.forEach((pdf) => {
      this.pdfs.push(...pdf.getPdfs());
    });
    return this.length;
  }

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
  override clone() {
    return new PDF(...this.pdfs);
  }

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
  override clean() {
    this.pdfs = [];
  }

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
  override async filter() {
    this.pdfs = await PDF.filter(...this.pdfs);
    return this.length;
  }

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
  async getDocuments(options?: LoadOptions) {
    return Promise.all(this.pdfs.map((pdf) => PDF.load(pdf.buffer, options)));
  }

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
  override async metadata(options?: LoadOptions) {
    return this.custom((document) => {
      return {
        title: document.getTitle(),
        author: document.getAuthor(),
        subject: document.getSubject(),
        creator: document.getCreator(),
        keywords: document.getKeywords(),
        producer: document.getProducer(),
        pageCount: document.getPageCount(),
        pageIndices: document.getPageIndices(),
        creationDate: document.getCreationDate(),
        modificationDate: document.getModificationDate(),
      };
    }, options);
  }

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
  async getPages(options?: LoadOptions) {
    return this.custom((document) => document.getPages(), options);
  }

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
  async getForm(options?: LoadOptions) {
    return this.custom((document) => document.getForm(), options);
  }

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
  async merge(options?: PDFMergeOptions) {
    const merge = await PDF.create(options?.create);
    const copies = await this.custom((document) => merge.copyPages(document, document.getPageIndices()), options?.load);
    copies.forEach((copied) => copied.forEach((page) => merge.addPage(page)));
    return PDF.save(merge);
  }

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
  async custom<T>(callback: PdfCustomDocumentCallback<T>, options?: LoadOptions): Promise<Awaited<T>[]> {
    const documents = await this.getDocuments(options);
    return Promise.all(documents.map(async (document, index) => callback(document, index)));
  }

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
  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    return PDF.new(buffer);
  }

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
  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    return PDF.new(buffer);
  }

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
  static async fromImage<T extends Buffer>(images: T, options?: PDFFromImageOptions): Promise<PDFDocument>;
  static async fromImage<T extends Buffer[]>(images: T, options?: PDFFromImageOptions): Promise<PDFDocument[]>;
  static async fromImage<T extends Buffer | Buffer[]>(images: T, options: PDFFromImageOptions = {}) {
    if (Array.isArray(images)) return Promise.all(images.map((image) => PDF.fromImage(image, options)));

    const [isPNG, isJPG] = await Promise.all([
      new FilterFile(images).custom("png"),
      new FilterFile(images).custom("jpg"),
    ]);
    if (isJPG.length === 0 && isPNG.length === 0) throw new Error(`${PDF.name}: Invalid images to convert to pdf`);

    const { pageSize = PageSizes.A4, scaleImage, position } = options;

    const pdf = await PDFDocument.create(options.create);
    const page = pdf.addPage(pageSize);
    const pageDimensions = page.getSize();

    let pdfImage: PDFImage;
    if (isPNG.length > 0) {
      pdfImage = await pdf.embedPng(images.buffer);
    } else {
      pdfImage = await pdf.embedJpg(images.buffer);
    }

    let imageDimensions = pdfImage.size();
    if (typeof scaleImage === "number") {
      imageDimensions = pdfImage.scale(scaleImage);
    } else if (Array.isArray(scaleImage)) {
      imageDimensions = pdfImage.scaleToFit(scaleImage[0], scaleImage[1]);
    } else {
      imageDimensions = pdfImage.scaleToFit(pageDimensions.width, pageDimensions.height);
    }

    page.drawImage(pdfImage, {
      x: position?.[0] ?? 0,
      y: position?.[1] ?? 0,
      width: imageDimensions.width,
      height: imageDimensions.height,
    });

    return pdf;
  }

  /**
   * @deprecated
   * Generate pdf from websites
   */
  static async generate<T extends string>(htmls: T, options?: PDFOptions): Promise<Buffer>;
  static async generate<T extends string[]>(htmls: T, options?: PDFOptions): Promise<Buffer[]>;
  static async generate<T extends string | string[]>(htmls: T, options?: PDFOptions) {
    if (Array.isArray(htmls)) return Promise.all(htmls.map((html) => PDF.generate(html, options)));

    const browser = await Core.initBrowser();
    const page = await browser.newPage();

    const res = await page.goto(htmls, { waitUntil: "networkidle2" });
    if (res === null || !res.ok()) throw new Error(`${PDF.name}: Can't fetch (${htmls})`);

    const buffer = await page.pdf(options);
    await browser.close();
    return buffer;
  }

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
  static async filter(...pdfs: Buffer[]) {
    return new FilterFile(...pdfs).custom("pdf");
  }

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
  static async save<T extends PDFDocument>(pdfs: T, options?: SaveOptions): Promise<Buffer>;
  static async save<T extends PDFDocument[]>(pdfs: T, options?: SaveOptions): Promise<Buffer[]>;
  static async save<T extends PDFDocument | PDFDocument[]>(pdfs: T, options?: SaveOptions) {
    if (Array.isArray(pdfs)) return Promise.all(pdfs.map((pdf) => PDF.save(pdf, options)));

    const save = await pdfs.save(options);
    return Core.toBuffer(save);
  }

  static async load<T extends string | Uint8Array | ArrayBuffer>(pdf: T, options?: LoadOptions) {
    return PDFDocument.load(pdf, options);
  }

  static async create(options?: CreateOptions) {
    return PDFDocument.create(options);
  }

  static document() {
    return PDFDocument;
  }

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
  static async new(pdfs: Buffer[]) {
    const filtered = await PDF.filter(...pdfs);
    if (filtered.length === 0) throw new Error(`${PDF.name}: Non valid pdf`);
    return new PDF(...filtered);
  }

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
  static isPDF(obj: unknown): obj is PDF {
    return obj instanceof PDF;
  }
}
