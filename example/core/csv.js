import { core } from "../../build/index.js";
import PDF from "../../build/core/pdf.js";

const _pdf = new core.PDF(Buffer.alloc(1));
const pdf = new PDF(Buffer.alloc(1));

pdf.getPdfs(); // return stored pdf
// => Buffer[]

// This method filter non buffer values
pdf.setPdfs(
  /* async */ (pdf, index) => {
    return Buffer.concat([pdf, Buffer.alloc(index)]);
  }
);
// => Promise<void>

// This method filter non pdf
pdf.append(Buffer.alloc(1));
// => Promise<void>

pdf.extend(new PDF(Buffer.alloc(1)));
// => void

pdf.clone();
// => PDF

// this method filter non pdf and return the new length of pdf
pdf.filter();
// => Promise<number>

pdf.metadata()
// => Promise<{ title: string | undefined; author: string | undefined; subject: string | undefined; creator: string | undefined; keywords: string | undefined; producer: string | undefined; pageCount: number; pageIndices: number[]; creationDate: Date | undefined; modificationDate: Date | undefined; }[]>

pdf.custom(async (pdf, index) => {
  return pdf.addPage([index, index])
})
// => Promise<PDFPage[]>

PDF.fromFile("csv1.pdf", "csv2.pdf")
// => Promise<PDF>

PDF.fromFile("https://example.com/csv1.pdf", "https://example.com/csv2.pdf")
// Promise<PDF>
