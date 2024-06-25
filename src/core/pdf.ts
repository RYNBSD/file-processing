import type { PDFOptions } from "puppeteer";
import type { CreateOptions, LoadOptions, SaveOptions } from "pdf-lib";
import type {
  PdfCustomDocumentCallback,
  PDFSetCallback,
} from "../types/index.js";
import { PDFDocument } from "pdf-lib";
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
    const pdfs = await Promise.all(
      this.pdfs.map((pdf, index) => callback(pdf, index))
    );
    const filteredPdfs = pdfs.filter((pdf) => Buffer.isBuffer(pdf)) as Buffer[];
    this.pdfs = filteredPdfs;
  }

  override async append(...pdfs: Buffer[]) {
    const filteredPdfs = await PDF.filter(...pdfs);
    this.pdfs.push(...filteredPdfs);
  }

  override extend(...pdfs: PDF[]) {
    pdfs.forEach((pdf) => {
      this.pdfs.push(...pdf.getPdfs());
    });
  }

  override clone() {
    return new PDF(...this.pdfs);
  }

  override async filter() {
    this.pdfs = await PDF.filter(...this.pdfs);
    return this.length;
  }

  async getDocuments(options?: LoadOptions) {
    return Promise.all(this.pdfs.map((pdf) => PDF.load(pdf.buffer, options)));
  }

  override async metadata(options?: LoadOptions) {
    const documents = await this.getDocuments(options);
    return documents.map((document) => ({
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
    }));
  }

  async getPages(options?: LoadOptions) {
    const documents = await this.getDocuments(options);
    return documents.map((document) => document.getPages());
  }

  async getForm(options?: LoadOptions) {
    const documents = await this.getDocuments(options);
    return documents.map((document) => document.getForm());
  }

  async merge() {
    const merge = await PDF.create();

    const copies = await Promise.all(
      this.pdfs.map(async (pdf) => {
        const p = await PDF.load(pdf.buffer);
        return merge.copyPages(p, p.getPageIndices());
      })
    );

    copies.forEach((copied) => copied.forEach((page) => merge.addPage(page)));
    return merge;
  }

  async custom<T>(
    callback: PdfCustomDocumentCallback<T>,
    options?: LoadOptions
  ): Promise<Awaited<T>[]> {
    const documents = await this.getDocuments(options);
    return Promise.all(
      documents.map((document, index) => callback(document, index))
    );
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
   * Generate pdf from websites
   */
  static async generate<T extends string>(
    htmls: T,
    options?: PDFOptions
  ): Promise<Buffer>;
  static async generate<T extends string[]>(
    htmls: T,
    options?: PDFOptions
  ): Promise<Buffer[]>;
  static async generate<T extends string | string[]>(
    htmls: T,
    options?: PDFOptions
  ) {
    if (Array.isArray(htmls))
      return Promise.all(htmls.map((html) => PDF.generate(html, options)));

    const browser = await Core.initBrowser();
    const page = await browser.newPage();

    const res = await page.goto(htmls, { waitUntil: "networkidle2" });
    if (res === null || !res.ok())
      throw new Error(`${PDF.name}: Can\'t fetch (${htmls})`);

    const buffer = await page.pdf(options);
    await browser.close();
    return buffer;
  }

  static filter(...pdfs: Buffer[]) {
    return new FilterFile(...pdfs).custom("pdf");
  }

  static async save<T extends PDFDocument>(
    pdfs: T,
    options?: SaveOptions
  ): Promise<Uint8Array>;
  static async save<T extends PDFDocument[]>(
    pdfs: T,
    options?: SaveOptions
  ): Promise<Uint8Array[]>;
  static async save<T extends PDFDocument | PDFDocument[]>(
    pdfs: T,
    options?: SaveOptions
  ) {
    if (!Array.isArray(pdfs)) return pdfs.save(options);
    return Promise.all(pdfs.map((pdf) => PDF.save(pdf, options)));
  }

  static async load<T extends string | Uint8Array | ArrayBuffer>(
    pdf: T,
    options?: LoadOptions
  ) {
    return PDFDocument.load(pdf, options);
  }

  static async create(options?: CreateOptions) {
    return PDFDocument.create(options);
  }

  static document() {
    return PDFDocument;
  }
}
