import type { PDFOptions } from "puppeteer";
import type { CreateOptions, LoadOptions, PDFImage, SaveOptions } from "pdf-lib";
import type {
  PdfCustomDocumentCallback,
  PDFFromImageOptions,
  PDFMergeOptions,
  PDFSetCallback,
} from "../types/index.js";
import { PageSizes, PDFDocument } from "pdf-lib";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";

export default class PDF extends Core {
  private pdfs: Buffer[];

  constructor(...pdfs: Buffer[]) {
    super();
    this.pdfs = pdfs;
  }

  get length() {
    return this.pdfs.length;
  }

  getPdfs() {
    return [...this.pdfs];
  }

  async setPdfs<T>(callback: PDFSetCallback<T>) {
    const pdfs = await Promise.all(this.pdfs.map(async (pdf, index) => callback(pdf, index)));
    const filteredPdfs = pdfs.filter((pdf) => Buffer.isBuffer(pdf) && pdf.length > 0) as Buffer[];
    const validPdfs = await PDF.filter(...filteredPdfs);
    this.pdfs = validPdfs;
    return this.length;
  }

  override async append(...pdfs: Buffer[]) {
    const filteredPdfs = await PDF.filter(...pdfs);
    this.pdfs.push(...filteredPdfs);
    return this.length;
  }

  override extend(...pdfs: PDF[]) {
    pdfs.forEach((pdf) => {
      this.pdfs.push(...pdf.getPdfs());
    });
    return this.length;
  }

  override clone() {
    return new PDF(...this.pdfs);
  }

  override async filter() {
    this.pdfs = await PDF.filter(...this.pdfs);
    return this.length;
  }

  async getDocuments(options?: LoadOptions) {
    return Promise.all(this.pdfs.map(async (pdf) => PDF.load(pdf.buffer, options)));
  }

  override async metadata(options?: LoadOptions) {
    const documents = await this.getDocuments(options);
    return Promise.all(
      documents.map(async (document) => ({
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
      })),
    );
  }

  async getPages(options?: LoadOptions) {
    const documents = await this.getDocuments(options);
    return Promise.all(documents.map(async (document) => document.getPages()));
  }

  async getForm(options?: LoadOptions) {
    const documents = await this.getDocuments(options);
    return Promise.all(documents.map(async (document) => document.getForm()));
  }

  async merge(options?: PDFMergeOptions) {
    const merge = await PDF.create(options?.create);

    const copies = await Promise.all(
      this.pdfs.map(async (pdf) => {
        const p = await PDF.load(pdf.buffer, options?.load);
        return merge.copyPages(p, p.getPageIndices());
      }),
    );

    copies.forEach((copied) => copied.forEach((page) => merge.addPage(page)));
    return merge;
  }

  async custom<T>(callback: PdfCustomDocumentCallback<T>, options?: LoadOptions): Promise<Awaited<T>[]> {
    const documents = await this.getDocuments(options);
    return Promise.all(documents.map(async (document, index) => callback(document, index)));
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    const pdfs = await PDF.filter(...buffer);
    return new PDF(...pdfs);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    const pdfs = await PDF.filter(...buffer);
    return new PDF(...pdfs);
  }

  /**
   * Convert image to pdf
   * @param images - must be of format png or jpg
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

  static filter(...pdfs: Buffer[]) {
    return new FilterFile(...pdfs).custom("pdf");
  }

  static async save<T extends PDFDocument>(pdfs: T, options?: SaveOptions): Promise<Uint8Array>;
  static async save<T extends PDFDocument[]>(pdfs: T, options?: SaveOptions): Promise<Uint8Array[]>;
  static async save<T extends PDFDocument | PDFDocument[]>(pdfs: T, options?: SaveOptions) {
    if (!Array.isArray(pdfs)) return pdfs.save(options);
    return Promise.all(pdfs.map((pdf) => PDF.save(pdf, options)));
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
}
