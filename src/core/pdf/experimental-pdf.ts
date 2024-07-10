// @ts-nocheck

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
  private pdfs: Buffer[] = [];

  constructor(...pdfs: Buffer[]) {
    this.pdfs = pdfs;
  }

  /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#document-metadata */
  async metadata() {
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
  }

  /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-text */
  async getTexts() {
    return this.custom((document) => {
      const texts: string[] = [];
      const countPages = document.countPages();
      for (let i = 0; i < countPages; i++) {
        const page = document.loadPage(i);
        texts.push(page.toStructuredText("preserve-whitespace").asJSON());
      }
      return texts;
    });
  }

  /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-images */
  async getImages() {
    return this.custom((document) => {
      const images: Buffer[][] = [];
      const countPages = document.countPages();

      for (let i = 0; i < countPages; i++) {
        const page = document.loadPage(i);
        const pageImages: Buffer[] = [];

        page.toStructuredText("preserve-images").walk({
          async onImageBlock(_bbox, _transform, image) {
            const pixmap = image.toPixmap();
            const png = pixmap.asPNG();
            const buffer = await Core.toBuffer(png);
            pageImages.push(buffer);
          },
        });

        images.push(pageImages);
      }

      return images;
    });
  }

  /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-annotations */
  async annotations() {
    return this.custom((document) => {
      const annots: mupdf.PDFAnnotation[][] = [];
      const countPages = document.countPages();
      for (let i = 0; i < countPages; i++) {
        const page = document.loadPage(i);
        annots.push(page.getAnnotations());
      }
      return annots;
    });
  }

  /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#getting-document-links */
  async links() {
    return this.custom((document) => {
      const links: string[][] = [];
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
  }

  /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#baking-a-document */
  async bake(annots?: boolean, widget?: boolean) {
    return this.custom((document) => {
      document.bake(annots, widget);
    });
  }

  /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#searching-a-document */
  async search(s: string) {
    return this.custom((document) => {});
  }

  async custom<T>(callback: (document: mupdf.PDFDocument, index: number) => T) {
    return Promise.all(
      this.pdfs.map(async (pdf, index) => {
        const document = PDF_experimental.open(pdf);
        return callback(document, index);
      }),
    );
  }

  static open(pdf: Buffer) {
    return new mupdf.PDFDocument(pdf);
  }

  static needsPassword(pdf: Buffer) {
    const document = PDF_experimental.open(pdf);
    return document.needsPassword();
  }
}
