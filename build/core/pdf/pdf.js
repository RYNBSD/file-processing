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
import { FilterFile, loader, parser } from "../../helper/index.js";
import { ProcessorError } from "../../error/index.js";
import Core from "../core.js";
export default class PDF extends Core {
    constructor(...pdfs) {
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
    setPdfs(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const pdfs = yield Promise.all(this.pdfs.map((pdf, index) => __awaiter(this, void 0, void 0, function* () { return callback(pdf, index); })));
            const filteredPdfs = pdfs.filter((pdf) => Buffer.isBuffer(pdf) && pdf.length > 0);
            const validPdfs = yield PDF.filter(...filteredPdfs);
            this.pdfs = validPdfs;
            return this.length;
        });
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
    append(...pdfs) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredPdfs = yield PDF.filter(...pdfs);
            this.pdfs.push(...filteredPdfs);
            return this.length;
        });
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
    extend(...pdfs) {
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
    clone() {
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
    clean() {
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
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pdfs = yield PDF.filter(...this.pdfs);
            return this.length;
        });
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
    getDocuments(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.pdfs.map((pdf) => PDF.load(pdf.buffer, options)));
        });
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
    metadata(options) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
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
    getPages(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => document.getPages(), options);
        });
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
    getForm(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => document.getForm(), options);
        });
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
    merge(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const merge = yield PDF.create(options === null || options === void 0 ? void 0 : options.create);
            const copies = yield this.custom((document) => merge.copyPages(document, document.getPageIndices()), options === null || options === void 0 ? void 0 : options.load);
            copies.forEach((copied) => copied.forEach((page) => merge.addPage(page)));
            return PDF.save(merge);
        });
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
    custom(callback, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield this.getDocuments(options);
            return Promise.all(documents.map((document, index) => __awaiter(this, void 0, void 0, function* () { return callback(document, index); })));
        });
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
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield loader.loadFile(path);
            return PDF.new(buffer);
        });
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
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield loader.loadUrl(url);
            return PDF.new(buffer);
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
                throw ProcessorError.pdf("Invalid images to convert to pdf");
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
    /**
     * @deprecated
     * Generate pdf from websites
     */
    // static async generate<T extends string>(htmls: T, options?: PDFOptions): Promise<Buffer>;
    // static async generate<T extends string[]>(htmls: T, options?: PDFOptions): Promise<Buffer[]>;
    // static async generate<T extends string | string[]>(htmls: T, options?: PDFOptions) {
    //   if (Array.isArray(htmls)) return Promise.all(htmls.map((html) => PDF.generate(html, options)));
    //   const browser = await Core.initBrowser();
    //   const page = await browser.newPage();
    //   const res = await page.goto(htmls, { waitUntil: "networkidle2" });
    //   if (res === null || !res.ok()) throw new Error(`${PDF.name}: Can't fetch (${htmls})`);
    //   const buffer = await page.pdf(options);
    //   await browser.close();
    //   return buffer;
    // }
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
    static filter(...pdfs) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...pdfs).custom("pdf");
        });
    }
    static save(pdfs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(pdfs))
                return Promise.all(pdfs.map((pdf) => PDF.save(pdf, options)));
            const save = yield pdfs.save(options);
            return parser.toBuffer(save);
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
    static new(pdfs) {
        return __awaiter(this, void 0, void 0, function* () {
            const filtered = yield PDF.filter(...pdfs);
            if (filtered.length === 0)
                throw new Error(`${PDF.name}: Non valid pdf`);
            return new PDF(...filtered);
        });
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
    static isPDF(obj) {
        return obj instanceof PDF;
    }
}
//# sourceMappingURL=pdf.js.map