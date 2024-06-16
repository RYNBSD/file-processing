import type { CreateOptions, LoadOptions, SaveOptions } from "pdf-lib";
import type {
  PdfCustomDocumentCallback,
  PDFSetCallback,
} from "../types/index.js";
import { PDFDocument } from "pdf-lib";
// import puppeteer from "puppeteer";
import { uint8array2buffer } from "@ryn-bsd/from-buffer-to";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";

export default class PDF extends Core {
  private pdfs: Buffer[];

  constructor(...pdfs: Buffer[]) {
    super();
    this.pdfs = pdfs;
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

  async appendPdfs(...pdfs: Buffer[]) {
    const filteredPdfs = await PDF.filter(...pdfs);
    this.pdfs.push(...filteredPdfs);
  }

  extendPdfs(...pdfs: PDF[]) {
    pdfs.forEach((pdf) => {
      this.pdfs.push(...pdf.getPdfs());
    });
  }

  override clone() {
    return new PDF(...this.pdfs);
  }

  override async filter() {
    this.pdfs = await PDF.filter(...this.pdfs);
    return this.pdfs.length;
  }

  override async check() {
    const pdfs = await PDF.filter(...this.pdfs);
    if (pdfs.length === 0)
      throw new TypeError(`${PDF.name}: Files must be of type pdf`);
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

  async custom<T>(
    callback: PdfCustomDocumentCallback<T>,
    options?: LoadOptions
  ): Promise<Awaited<T>[]> {
    const documents = await this.getDocuments(options);
    return Promise.all(
      documents.map((document, index) => callback(document, index))
    );
  }

  static async fromFile(path: string) {
    const buffer = await Core.loadFile(path);
    return new PDF(buffer);
  }

  static async fromUrl<T extends string | URL>(url: T) {
    const buffer = await Core.loadUrl(url);
    return new PDF(buffer);
  }

  /**
   * Convert url to pdf
   */
  // static async fromUrl(
  //   html: string,
  //   format: puppeteer.PaperFormat,
  //   waitUntil: puppeteer.PuppeteerLifeCycleEvent = "networkidle0"
  // ) {
  //   const browser = await puppeteer.launch({ headless: false });
  //   const page = await browser.newPage();

  //   const res = await page.goto(html, { waitUntil });
  //   if (res === null || !res.ok())
  //     throw new Error(`${PDF.name}: Can't fetch html page`);

  //   const buffer = await page.pdf({ format });
  //   await browser.close();
  //   return new PDF(buffer);
  // }

  /**
   * Convert html string to pdf
   */
  // static async fromHtml(
  //   html: string,
  //   format: puppeteer.PaperFormat,
  //   waitUntil: puppeteer.PuppeteerLifeCycleEvent = "networkidle0"
  // ) {
  //   const browser = await puppeteer.launch({ headless: true });
  //   const page = await browser.newPage();

  //   await page.setContent(html, { waitUntil });
  //   const buffer = await page.pdf({
  //     format,
  //   });

  //   await browser.close();
  //   return new PDF(buffer);
  // }

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

  /**
   * Convert Uint8Array to Buffer
   */
  static async toBuffer<T extends Uint8Array>(
    pdfs: T,
    options?: SaveOptions
  ): Promise<Buffer>;
  static async toBuffer<T extends Uint8Array>(
    pdfs: T[],
    options?: SaveOptions
  ): Promise<Buffer[]>;
  static async toBuffer<T extends Uint8Array | Uint8Array[]>(
    pdfs: T,
    options?: SaveOptions
  ) {
    if (!Array.isArray(pdfs)) return uint8array2buffer(pdfs);
    return Promise.all(pdfs.map((pdf) => PDF.toBuffer(pdf, options)));
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
