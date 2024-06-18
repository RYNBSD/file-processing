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

  it("(de)compress", async () => {
    const textCompress = new Text(Buffer.alloc(5));

    const gzip = await textCompress.compress("gzip");
    let textDecompress = new Text(...gzip);
    await textDecompress.decompress("gunzip");

    const deflate = await textCompress.compress("deflate");
    textDecompress = new Text(...deflate);
    await textDecompress.decompress("inflate");

    const deflateRaw = await textCompress.compress("deflate-raw");
    textDecompress = new Text(...deflateRaw);
    await textDecompress.decompress("inflate-raw");

    const brotli = await textCompress.compress("brotli-compress");
    textDecompress = new Text(...brotli);
    await textDecompress.decompress("brotli-decompress");

    expect(true).toBe(true);
    await expect(async () => {
      await textCompress.compress("");
    }).rejects.toThrow(TypeError);
    await expect(async () => {
      await textDecompress.decompress("");
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
  });

  it("(static) fromUrl", async () => {
    const text = await Text.fromUrl(
      "https://cse.unl.edu/~cbourke/ComputerScienceOne.pdf"
    );
    expect(text).toBeInstanceOf(Text);
  });
});
