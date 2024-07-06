import fs from "node:fs";
import Text from "../../build/core/text.js";

describe("Text", () => {
  it("set/get/append/extend/clone", async () => {
    const text = new Text(Buffer.alloc(0));
    expect(text.getTexts()).toHaveLength(1);

    await text.append(Buffer.alloc(0));
    expect(text.getTexts()).toHaveLength(1);

    await text.setTexts((text) => text.toString());
    expect(text.getTexts()).toHaveLength(0);

    text.extend(new Text(Buffer.alloc(0)));
    expect(text.getTexts()).toHaveLength(1);

    expect(text.clone()).toBeInstanceOf(Text);
  });

  it("filter", async () => {
    const image = new Text(Buffer.alloc(0));
    const length = await image.filter();
    expect(length).toBe(0);
  });

  it("metadata", async () => {
    const text = new Text(Buffer.alloc(0));
    const metadata = await text.metadata();
    expect(metadata).toHaveLength(1);
    expect(metadata[0].size).toBe(0);
  });

  it("(de)compress async", async () => {
    const textCompress = new Text(Buffer.alloc(5));

    const gzip = await textCompress.compressAsync("gzip");
    let textDecompress = new Text(...gzip);
    await textDecompress.decompressAsync("gunzip");
    await textDecompress.decompressAsync("unzip");

    const deflate = await textCompress.compressAsync("deflate");
    textDecompress = new Text(...deflate);
    await textDecompress.decompressAsync("inflate");

    const deflateRaw = await textCompress.compressAsync("deflate-raw");
    textDecompress = new Text(...deflateRaw);
    await textDecompress.decompressAsync("inflate-raw");

    const brotli = await textCompress.compressAsync("brotli-compress");
    textDecompress = new Text(...brotli);
    await textDecompress.decompressAsync("brotli-decompress");

    await expect(async () => {
      await textCompress.compressAsync("");
    }).rejects.toThrow(TypeError);

    await expect(async () => {
      await textDecompress.decompressAsync("");
    }).rejects.toThrow(TypeError);
  });

  // it("(de)compress stream", async () => {
  //   const textCompress = new Text(Buffer.alloc(5));

  //   const gzip = await textCompress.compressStream("gzip");
  //   let textDecompress = new Text(...gzip);
  //   await textDecompress.decompressStream("gunzip");

  //   const deflate = await textCompress.compressStream("deflate");
  //   textDecompress = new Text(...deflate);
  //   await textDecompress.decompressStream("inflate");

  //   const deflateRaw = await textCompress.compressStream("deflate-raw");
  //   textDecompress = new Text(...deflateRaw);
  //   await textDecompress.decompressStream("inflate-raw");

  //   const brotli = await textCompress.compressStream("brotli-compress");
  //   textDecompress = new Text(...brotli);
  //   await textDecompress.decompressStream("brotli-decompress");

  //   await expect(async () => {
  //     await textCompress.compressStream("");
  //   }).rejects.toThrow(TypeError);

  //   await expect(async () => {
  //     await textDecompress.decompressStream("");
  //   }).rejects.toThrow(TypeError);
  // });

  it("(de)compress sync", async () => {
    const textCompress = new Text(Buffer.alloc(5));

    const gzip = textCompress.compressSync("gzip");
    let textDecompress = new Text(...gzip);
    textDecompress.decompressSync("gunzip");
    textDecompress.decompressSync("unzip");

    const deflate = textCompress.compressSync("deflate");
    textDecompress = new Text(...deflate);
    textDecompress.decompressSync("inflate");

    const deflateRaw = textCompress.compressSync("deflate-raw");
    textDecompress = new Text(...deflateRaw);
    textDecompress.decompressSync("inflate-raw");

    const brotli = textCompress.compressSync("brotli-compress");
    textDecompress = new Text(...brotli);
    textDecompress.decompressSync("brotli-decompress");

    await expect(async () => {
      textCompress.compressSync("");
    }).rejects.toThrow(TypeError);

    await expect(async () => {
      textDecompress.decompressSync("");
    }).rejects.toThrow(TypeError);
  });

  it("custom", async () => {
    const text = new Text(Buffer.alloc(1));

    const result = await text.custom(async (text) => {
      return text.toString();
    });

    expect(result).toHaveLength(1);
    expect(typeof result[0] === "string").toBe(true);
  });

  it("(static) fromFile", async () => {
    const text = await Text.fromFile("asset/csv.csv");
    expect(text).toBeInstanceOf(Text);
    expect(text.length).toEqual(1);
  });

  it("(static) fromUrl", async () => {
    const text = await Text.fromUrl("https://cse.unl.edu/~cbourke/ComputerScienceOne.pdf");
    expect(text).toBeInstanceOf(Text);
    expect(text.length).toEqual(1);
  });

  it("(static) new", async () => {
    const buffer = await Text.loadFile("asset/rynbsd.png");
    const text = Text.new([buffer]);
    expect(text).toBeInstanceOf(Text);
    expect(text.length).toEqual(1);

    await expect(async () => {
      Text.new([Buffer.alloc(0)]);
    }).rejects.toThrow();
  });

  it("(static) isText", () => {
    const text = new Text();
    const isText = Text.isText(text);
    expect(isText).toBe(true);

    const object = new Object();
    const isNotText = Text.isText(object);
    expect(isNotText).toBe(false);
  });
});
