import { PDFDocument } from "pdf-lib";
import PDF from "../../build/core/pdf.js";
import fs from "node:fs";

describe("PDF", () => {
  it("check", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf");
    await pdf.check();
    expect(true).toBe(true);

    await expect(async () => {
      await new PDF(Buffer.alloc(1)).check();
    }).rejects.toThrow();
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

  it("(static) fromFile", async () => {
    const file = await PDF.fromFile("asset/pdf.pdf");
    expect(file).toBeInstanceOf(PDF);

    const url = await PDF.fromFile(
      "https://cse.unl.edu/~cbourke/ComputerScienceOne.pdf"
    );
    expect(url).toBeInstanceOf(PDF);

    await expect(async () => {
      await PDF.fromFile("");
    }).rejects.toThrow();
  });

  // it("fromUrl", async () => {
  //   const pdf = await PDF.fromUrl("https://www.w3schools.com/");
  //   expect(pdf).toBeInstanceOf(PDF);
  // });

  // it("fromHtml", async () => {
  //   const pdf = await PDF.fromHtml("<h1>Hello world</h1>", "A4");
  //   expect(pdf).toBeInstanceOf(PDF);
  // });

  it("(static) save/toBuffer/load", async () => {
    const file = await fs.promises.readFile("asset/pdf.pdf");
    const pdf = await PDF.load(file.buffer);

    const save = await PDF.save(pdf);
    expect(save).toBeInstanceOf(Uint8Array);

    const buffer = await PDF.toBuffer(save);
    expect(buffer).toBeInstanceOf(Buffer);
  });

  it("create", async () => {
    const pdf = await PDF.create();
    expect(pdf).toBeInstanceOf(PDFDocument);
  });

  it("(static) document", async () => {
    const pdf = PDF.document();
    const read = await fs.promises.readFile("asset/pdf.pdf");
    const document = await pdf.load(read.buffer);
    expect(document).toBeInstanceOf(PDFDocument);
  });
});
