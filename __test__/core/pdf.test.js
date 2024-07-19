import { PDFDocument, PageSizes } from "pdf-lib";
import { imageBuffer } from "../index.js";
import PDF from "../../build/core/pdf/pdf.js";

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

  it("merge", async () => {
    const buffers = await PDF.loadFile(["asset/pdf.pdf", "asset/pdf.pdf", "asset/pdf.pdf"]);
    const document = await new PDF(...buffers).merge();
    expect(document).toBeInstanceOf(Buffer);
    await PDF.toFile([{ path: "tmp/merge.pdf", input: await document}]);
  });

  it("custom", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf");
    const result = await pdf.custom((pdf) => pdf.flush());
    expect(result).toHaveLength(1);
  });

  // it("(static) generate", async () => {
  //   const buffers = await PDF.generate([
  //     "https://www.google.com/",
  //     "https://www.google.com/",
  //     "https://www.google.com/",
  //   ]);
  //   expect(buffers.length).toBe(3);
  //   expect(buffers[0]).toBeInstanceOf(Buffer);
  //   expect(buffers[0].length).toBeGreaterThan(0);

  //   await expect(async () => {
  //     await PDF.generate("123");
  //   }).rejects.toThrow();
  // });

  it("(static) fromFile", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf");
    expect(pdf).toBeInstanceOf(PDF);
    expect(pdf.length).toEqual(1);

    await expect(async () => {
      await PDF.fromFile("https://cse.unl.edu/~cbourke/ComputerScienceOne.pdf");
    }).rejects.toThrow();
  });

  it("(static) fromUrl", async () => {
    const pdf = await PDF.fromUrl("https://cse.unl.edu/~cbourke/ComputerScienceOne.pdf");
    expect(pdf).toBeInstanceOf(PDF);
    expect(pdf.length).toEqual(1);

    await expect(async () => {
      await PDF.fromUrl("asset/pdf.pdf");
    }).rejects.toThrow();
  });

  it("(static) fromImage", async () => {
    const image1 = await imageBuffer();
    const image2 = await imageBuffer();
    const image3 = await imageBuffer();

    const pdfs = await PDF.fromImage([image1, image2, image3], {
      pageSize: PageSizes.A4,
      scaleImage: [50, 50],
    });

    pdfs.forEach((pdf) => expect(pdf).toBeInstanceOf(PDFDocument));

    await Promise.all(
      pdfs.map(async (pdf, index) => {
        PDF.toFile([
          {
            path: `tmp/${index}.pdf`,
            input: await pdf.save(),
          },
        ]);
      }),
    );
  });

  it("(static) save/toBuffer/load", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf", "asset/pdf.pdf", "asset/pdf.pdf");
    const documents = await Promise.all(pdf.getPdfs().map((b) => PDF.load(b)));

    const save = await PDF.save(documents);
    expect(save).toHaveLength(3);
    expect(save[0]).toBeInstanceOf(Uint8Array);

    const buffer = await PDF.toBuffer(save);
    expect(buffer).toHaveLength(3);
    expect(buffer[0]).toBeInstanceOf(Buffer);
  });

  it("(static) create", async () => {
    const pdf = await PDF.create();
    expect(pdf).toBeInstanceOf(PDFDocument);
  });

  it("(static) document", async () => {
    const pdf = await PDF.fromFile("asset/pdf.pdf", "asset/pdf.pdf", "asset/pdf.pdf");
    const documents = await Promise.all(pdf.getPdfs().map((b) => PDF.document().load(b)));
    expect(documents).toHaveLength(3);
    expect(documents[0]).toBeInstanceOf(PDFDocument);
  });

  it("(static) new", async () => {
    const buffer = await PDF.loadFile("asset/pdf.pdf");
    const pdf = await PDF.new([buffer]);
    expect(pdf).toBeInstanceOf(PDF);
    expect(pdf.length).toEqual(1);

    await expect(async () => {
      await PDF.new([Buffer.alloc(1)]);
    }).rejects.toThrow();
  });

  it("(static) isPDF", () => {
    const pdf = new PDF();
    const isPDF = PDF.isPDF(pdf);
    expect(isPDF).toBe(true);

    const object = new Object();
    const isNotPDF = PDF.isPDF(object);
    expect(isNotPDF).toBe(false);
  });
});
