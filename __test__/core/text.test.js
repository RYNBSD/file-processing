import Text from "../../build/core/text.js";

describe("Text", () => {
  it("check", async () => {
    await expect(async () => {
      await new Text(Buffer.alloc(1)).check();
    }).rejects.toThrow(TypeError);
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
});
