var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PDFDocument } from "pdf-lib";
// import puppeteer from "puppeteer";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";
export default class PDF extends Core {
    constructor(...pdfs) {
        super();
        this.pdfs = pdfs;
    }
    getPdfs() {
        return [...this.pdfs];
    }
    setPdfs(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfs = yield Promise.all(this.pdfs.map((pdf, index) => callback(pdf, index)));
            const filteredPdfs = pdfs.filter((pdf) => Buffer.isBuffer(pdf));
            this.pdfs = filteredPdfs;
        });
    }
    append(...pdfs) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredPdfs = yield PDF.filter(...pdfs);
            this.pdfs.push(...filteredPdfs);
        });
    }
    extend(...pdfs) {
        pdfs.forEach((pdf) => {
            this.pdfs.push(...pdf.getPdfs());
        });
    }
    clone() {
        return new PDF(...this.pdfs);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pdfs = yield PDF.filter(...this.pdfs);
            return this.pdfs.length;
        });
    }
    getDocuments(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.pdfs.map((pdf) => PDF.load(pdf.buffer, options)));
        });
    }
    metadata(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.getDocuments(options);
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
        });
    }
    getPages(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.getDocuments(options);
            return documents.map((document) => document.getPages());
        });
    }
    getForm(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.getDocuments(options);
            return documents.map((document) => document.getForm());
        });
    }
    custom(callback, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.getDocuments(options);
            return Promise.all(documents.map((document, index) => callback(document, index)));
        });
    }
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return new PDF(...buffer);
        });
    }
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return new PDF(...buffer);
        });
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
    static filter(...pdfs) {
        return new FilterFile(...pdfs).custom("pdf");
    }
    static save(pdfs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(pdfs))
                return pdfs.save(options);
            return Promise.all(pdfs.map((pdf) => PDF.save(pdf, options)));
        });
    }
    static load(pdf, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return PDFDocument.load(pdf, options);
        });
    }
    static create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return PDFDocument.create(options);
        });
    }
    static document() {
        return PDFDocument;
    }
}
//# sourceMappingURL=pdf.js.map