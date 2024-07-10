/// <reference types="node" resolution-mode="require"/>
import * as mupdf from "mupdf";
export default class PDF_experimental {
    private pdfs;
    constructor(...pdfs: Buffer[]);
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#document-metadata */
    metadata(): Promise<{
        format: string | undefined;
        encryption: string | undefined;
        author: string | undefined;
        title: string | undefined;
        subject: string | undefined;
        keywords: string | undefined;
        creator: string | undefined;
        producer: string | undefined;
        countUnsavedVersions: number;
        countVersions: number;
        countObjects: number;
        countPages: number;
        wasRepaired: boolean;
        language: string;
        version: number;
        creationDate: string | undefined;
        modificationDate: string | undefined;
    }[]>;
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-text */
    getTexts(): Promise<string[][]>;
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-images */
    getImages(): Promise<Buffer[][][]>;
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#extracting-document-annotations */
    annotations(): Promise<mupdf.PDFAnnotation[][][]>;
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#getting-document-links */
    links(): Promise<string[][][]>;
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#baking-a-document */
    bake(annots?: boolean, widget?: boolean): Promise<void[]>;
    /** @link https://mupdfjs.readthedocs.io/en/latest/how-to-guide/node/document/index.html#searching-a-document */
    search(s: string): Promise<void[]>;
    custom<T>(callback: (document: mupdf.PDFDocument, index: number) => T): Promise<Awaited<T>[]>;
    static open(pdf: Buffer): mupdf.PDFDocument;
    static needsPassword(pdf: Buffer): boolean;
}
//# sourceMappingURL=experimental-pdf.d.ts.map