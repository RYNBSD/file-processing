/// <reference types="node" resolution-mode="require"/>
import type { CreateOptions, LoadOptions, PDFDocument, PDFPage } from "pdf-lib";
export type PDFMergeOptions = {
    create?: CreateOptions;
    load?: LoadOptions;
};
export type PDFFromImageOptions = {
    create?: CreateOptions;
    /**
     * @default PageSizes.A4
     */
    pageSize?: PDFPage | [width: number, height: number];
    /**
     * @default [pageWidth,pageHeight]
     */
    scaleImage?: number | [width: number, height: number];
    /**
     * @default [0,0]
     */
    position?: [x: number, y: number];
};
export type PDFSetCallback<T> = (pdf: Buffer, index: number) => Promise<T> | T;
export type PdfCustomDocumentCallback<T> = (pdf: PDFDocument, index: number) => Promise<T> | T;
//# sourceMappingURL=pdf.d.ts.map