import { PDFDocument } from "pdf-lib";
import PDF from "../../build/core/pdf.js";
import fs from "node:fs";

describe("PDF", () => {
  it("set/get/append/extend/clone", async () => {
    const pdf = new PDF(Buffer.alloc(0));
    expect(pdf.getPdfs()).toHaveLength(1);

    const buffer = await PDF.loadFile("asset/pdf.pdf");
    await pdf.append(Buffer.alloc(0), buffer);
    expect(pdf.getPdfs()).toHaveLength(2);

    await pdf.setPdfs((pdf) => pdf.toString());
    expect(pdf.getPdfs()).toHaveLength(0);

    pdf.extend(new PDF(Buffer.alloc(0)));
    expect(pdf.getPdfs()).toHaveLength(1);

    expect(pdf.clone()).toBeInstanceOf(PDF);
  });

  it("filter", async () => {
    const pdf = new PDF(Buffer.alloc(0));
    const length = await pdf.filter();
    expect(length).toBe(0);
  });

  it("metadata", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf");
    const metadata = await pdf.metadata();
    expect(metadata).toHaveLength(1);
  });

  it("getPage", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf");
    const pages = await pdf.getPages();
    expect(pages).toHaveLength(1);
  });

  it("getForm", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf");
    const form = await pdf.getForm();
    expect(form).toHaveLength(1);
  });

  it("custom", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf");
    const result = await pdf.custom((pdf) => pdf.flush());
    expect(result).toHaveLength(1);
  });

  it("(static) generate", async () => {
    const buffers = await PDF.generate([
      "https://www.google.com/",
      "https://www.google.com/",
      "https://www.google.com/",
    ]);
    expect(buffers.length).toBe(3);
    expect(buffers[0]).toBeInstanceOf(Buffer);
    expect(buffers[0].length).toBeGreaterThan(0);

    await expect(async () => {
      await PDF.generate("123");
    }).rejects.toThrow();
  })

  it("(static) fromFile", async () => {
    const file = await PDF.fromFile("asset/pdf.pdf");
    expect(file).toBeInstanceOf(PDF);

    await expect(async () => {
      await PDF.fromFile("https://cse.unl.edu/~cbourke/ComputerScienceOne.pdf");
    }).rejects.toThrow();
  });

  it("(static) fromUrl", async () => {
    const pdf = await PDF.fromUrl(
      "https://cse.unl.edu/~cbourke/ComputerScienceOne.pdf"
    );
    expect(pdf).toBeInstanceOf(PDF);

    await expect(async () => {
      await PDF.fromUrl("asset/pdf.pdf");
    }).rejects.toThrow();
  });

  it("(static) save/toBuffer/load", async () => {
    const pdf = await PDF.fromFile(
      "asset/pdf.pdf",
      "asset/pdf.pdf",
      "asset/pdf.pdf"
    );
    const documents = await Promise.all(pdf.getPdfs().map((b) => PDF.load(b)));

    const save = await PDF.save(documents);
    expect(save).toHaveLength(3);
    expect(save[0]).toBeInstanceOf(Uint8Array);

    const buffer = await PDF.toBuffer(save);
    expect(buffer).toHaveLength(3);
    expect(buffer[0]).toBeInstanceOf(Buffer);
  });

  it("create", async () => {
    const pdf = await PDF.create();
    expect(pdf).toBeInstanceOf(PDFDocument);
  });

  it("(static) document", async () => {
    const pdf = await PDF.fromFile(
      "asset/pdf.pdf",
      "asset/pdf.pdf",
      "asset/pdf.pdf"
    );
    const documents = await Promise.all(
      pdf.getPdfs().map((b) => PDF.document().load(b))
    );
    expect(documents).toHaveLength(3);
    expect(documents[0]).toBeInstanceOf(PDFDocument);
  });
});
