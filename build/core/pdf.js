var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PageSizes, PDFDocument } from "pdf-lib";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";
export default class PDF extends Core {
    constructor(...pdfs) {
        super();
        this.pdfs = pdfs;
    }
    get length() {
        return this.pdfs.length;
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
            return this.length;
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
            return Promise.all(documents.map((document) => __awaiter(this, void 0, void 0, function* () {
                return ({
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
                });
            })));
        });
    }
    getPages(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.getDocuments(options);
            return Promise.all(documents.map((document) => __awaiter(this, void 0, void 0, function* () { return document.getPages(); })));
        });
    }
    getForm(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.getDocuments(options);
            return Promise.all(documents.map((document) => __awaiter(this, void 0, void 0, function* () { return document.getForm(); })));
        });
    }
    merge(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const merge = yield PDF.create(options === null || options === void 0 ? void 0 : options.create);
            const copies = yield Promise.all(this.pdfs.map((pdf) => __awaiter(this, void 0, void 0, function* () {
                const p = yield PDF.load(pdf.buffer, options === null || options === void 0 ? void 0 : options.load);
                return merge.copyPages(p, p.getPageIndices());
            })));
            copies.forEach((copied) => copied.forEach((page) => merge.addPage(page)));
            return merge;
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
            const pdfs = yield PDF.filter(...buffer);
            return new PDF(...pdfs);
        });
    }
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            const pdfs = yield PDF.filter(...buffer);
            return new PDF(...pdfs);
        });
    }
    static fromImage(images_1) {
        return __awaiter(this, arguments, void 0, function* (images, options = {}) {
            var _a, _b;
            if (Array.isArray(images))
                return Promise.all(images.map((image) => PDF.fromImage(image, options)));
            const [isPNG, isJPG] = yield Promise.all([
                new FilterFile(images).custom("png"),
                new FilterFile(images).custom("jpg"),
            ]);
            if (isJPG.length === 0 && isPNG.length === 0)
                throw new Error(`${PDF.name}: Invalid images to convert to pdf`);
            const { pageSize = PageSizes.A4, scaleImage, position } = options;
            const pdf = yield PDFDocument.create(options.create);
            const page = pdf.addPage(pageSize);
            const pageDimensions = page.getSize();
            let pdfImage;
            if (isPNG.length > 0) {
                pdfImage = yield pdf.embedPng(images.buffer);
            }
            else {
                pdfImage = yield pdf.embedJpg(images.buffer);
            }
            console.log("scaleImage: ", scaleImage);
            let imageDimensions = pdfImage.size();
            if (typeof scaleImage === "number") {
                imageDimensions = pdfImage.scale(scaleImage);
            }
            else if (Array.isArray(scaleImage)) {
                imageDimensions = pdfImage.scaleToFit(scaleImage[0], scaleImage[1]);
            }
            else {
                imageDimensions = pdfImage.scaleToFit(pageDimensions.width, pageDimensions.height);
            }
            page.drawImage(pdfImage, {
                x: (_a = position === null || position === void 0 ? void 0 : position[0]) !== null && _a !== void 0 ? _a : 0,
                y: (_b = position === null || position === void 0 ? void 0 : position[1]) !== null && _b !== void 0 ? _b : 0,
                width: imageDimensions.width,
                height: imageDimensions.height,
            });
            return pdf;
        });
    }
    static generate(htmls, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(htmls))
                return Promise.all(htmls.map((html) => PDF.generate(html, options)));
            const browser = yield Core.initBrowser();
            const page = yield browser.newPage();
            const res = yield page.goto(htmls, { waitUntil: "networkidle2" });
            if (res === null || !res.ok())
                throw new Error(`${PDF.name}: Can\'t fetch (${htmls})`);
            const buffer = yield page.pdf(options);
            yield browser.close();
            return buffer;
        });
    }
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