import type { PDFDocument } from "pdf-lib";

export type PDFSetCallback<T> = (pdf: Buffer, index: number) => Promise<T> | T;

export type PdfCustomDocumentCallback<T> = (
  pdf: PDFDocument,
  index: number
) => Promise<T> | T;
