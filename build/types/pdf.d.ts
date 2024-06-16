/// <reference types="node" resolution-mode="require"/>
import type { PDFDocument } from "pdf-lib";
export type PDFSetCallback<T> = (pdf: Buffer, index: number) => Promise<T> | T;
export type PdfCustomDocumentCallback<T> = (pdf: PDFDocument, index: number) => Promise<T> | T;
//# sourceMappingURL=pdf.d.ts.map