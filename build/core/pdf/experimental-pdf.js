// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//! New PDF processor focused on performance, still under development
//? Why new PDF processor? pdf-lib is a great library designed for JS
//? The library is not maintained from 3 years ago, making adding new
//? Features hard, and require for more packages and configuration.
//? Making more harder to maintain this package, and make performance
//? Not the best think.
//* The old version is still supported and maintained until,
//* Finish with this version or rollback to the old.
//* This version is based on mupdf (https://mupdf.com/), a library
//* written in C, make it the best choice.
import * as mupdf from "mupdf";
import Core from "../core.js";
export default class PDF_experimental {
    constructor(...pdfs) {
        this.pdfs = [];
        this.pdfs = pdfs;
    }
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#document-metadata */
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => {
                return {
                    format: document.getMetaData(mupdf.Document.META_FORMAT),
                    encryption: document.getMetaData(mupdf.Document.META_ENCRYPTION),
                    author: document.getMetaData(mupdf.Document.META_INFO_AUTHOR),
                    title: document.getMetaData(mupdf.Document.META_INFO_TITLE),
                    subject: document.getMetaData(mupdf.Document.META_INFO_SUBJECT),
                    keywords: document.getMetaData(mupdf.Document.META_INFO_KEYWORDS),
                    creator: document.getMetaData(mupdf.Document.META_INFO_CREATOR),
                    producer: document.getMetaData(mupdf.Document.META_INFO_PRODUCER),
                    countUnsavedVersions: document.countUnsavedVersions(),
                    countVersions: document.countVersions(),
                    countObjects: document.countObjects(),
                    countPages: document.countPages(),
                    wasRepaired: document.wasRepaired(),
                    language: document.getLanguage(),
                    version: document.getVersion(),
                    creationDate: document.getMetaData(mupdf.Document.META_INFO_CREATIONDATE),
                    modificationDate: document.getMetaData(mupdf.Document.META_INFO_MODIFICATIONDATE),
                };
            });
        });
    }
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-text */
    getTexts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => {
                const texts = [];
                const countPages = document.countPages();
                for (let i = 0; i < countPages; i++) {
                    const page = document.loadPage(i);
                    texts.push(page.toStructuredText("preserve-whitespace").asJSON());
                }
                return texts;
            });
        });
    }
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-images */
    getImages() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => {
                const images = [];
                const countPages = document.countPages();
                for (let i = 0; i < countPages; i++) {
                    const page = document.loadPage(i);
                    const pageImages = [];
                    page.toStructuredText("preserve-images").walk({
                        onImageBlock(_bbox, _transform, image) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const pixmap = image.toPixmap();
                                const png = pixmap.asPNG();
                                const buffer = yield Core.toBuffer(png);
                                pageImages.push(buffer);
                            });
                        },
                    });
                    images.push(pageImages);
                }
                return images;
            });
        });
    }
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-annotations */
    annotations() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => {
                const annots = [];
                const countPages = document.countPages();
                for (let i = 0; i < countPages; i++) {
                    const page = document.loadPage(i);
                    annots.push(page.getAnnotations());
                }
                return annots;
            });
        });
    }
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#getting-document-links */
    links() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => {
                const links = [];
                const countPages = document.countPages();
                for (let i = 0; i < countPages; i++) {
                    const page = document.loadPage(i);
                    const pageLinks = page.getLinks().map((link) => ({
                        bounds: link.getBounds(),
                        link: link.getURI(),
                        isExternal: link.isExternal(),
                    }));
                    links.push(pageLinks);
                }
                return links;
            });
        });
    }
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#baking-a-document */
    bake(annots, widget) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => {
                document.bake(annots, widget);
            });
        });
    }
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#searching-a-document */
    search(s) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((document) => { });
        });
    }
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.pdfs.map((pdf, index) => __awaiter(this, void 0, void 0, function* () {
                const document = PDF_experimental.open(pdf);
                return callback(document, index);
            })));
        });
    }
    static open(pdf) {
        return new mupdf.PDFDocument(pdf);
    }
    static needsPassword(pdf) {
        const document = PDF_experimental.open(pdf);
        return document.needsPassword();
    }
}
//# sourceMappingURL=experimental-pdf.js.map