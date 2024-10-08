import fs from "node:fs";
import { faker } from "@faker-js/faker";
import Image from "../../build/core/image.js";
import { loader, parser } from "../../build/helper/index.js";
import { imageBuffer } from "../index.js";

describe("Image", () => {
  it("set/get/append/extend/clone", async () => {
    const image = new Image(Buffer.alloc(0));
    expect(image.getImages()).toHaveLength(1);

    const buffer = await loader.loadFile("asset/rynbsd.png");
    await image.append(Buffer.alloc(0), buffer);
    expect(image.getImages()).toHaveLength(2);

    await image.setImages((image) => image.toString());
    expect(image.getImages()).toHaveLength(0);

    image.extend(new Image(Buffer.alloc(0)));
    expect(image.getImages()).toHaveLength(1);

    expect(image.clone()).toBeInstanceOf(Image);
  });

  it("filter", async () => {
    const buffer = await loader.loadFile("asset/rynbsd.png");
    const image = new Image(buffer, Buffer.alloc(0));
    const length = await image.filter();
    expect(length).toBe(1);
  });

  it("metadata", async () => {
    const buffer = await loader.loadFile("asset/rynbsd.png");

    const metadata = await new Image(buffer).metadata();
    expect(metadata).toHaveLength(1);

    await expect(async () => {
      await new Image(Buffer.alloc(1)).metadata();
    }).rejects.toThrow();
  });

  it("watermark", async () => {
    const logo = await fs.promises.readFile("asset/watermark.png");
    const image = await loader.loadFile("asset/rynbsd.png");

    const watermark = await new Image(image).watermark(logo, {
      resize: { width: 50, height: 50 },
    });

    expect(watermark).toHaveLength(1);

    await parser.toFile([
      {
        path: "tmp/watermark.png",
        input: Image.justBuffer(watermark[0]),
      },
    ]);
  });

  it("convert", async () => {
    const buffer = await loader.loadFile("asset/rynbsd.png");

    const convert = await new Image(buffer).convert("jpeg");
    expect(convert).toHaveLength(1);

    await expect(async () => {
      await new Image(Buffer.alloc(1)).convert();
    }).rejects.toThrow();
  });

  it("ocr", async () => {
    const buffer = await loader.loadFile("asset/rynbsd.png");
    const ocr = await new Image(buffer).ocr("eng");
    expect(ocr).toHaveLength(1);
    expect(ocr[0].text.trim()).toEqual("RYN\nBSD");
  });

  it("custom", async () => {
    const buffer = await loader.loadFile("asset/rynbsd.png");
    const custom = await new Image(buffer).custom((sharp) => {
      return sharp.jpeg().resize({ width: 1280, height: 720, fit: "fill" }).blur().toBuffer();
    });
    expect(custom).toHaveLength(1);
  });

  // it("(static) screenshot", async () => {
  //   const buffers = await Image.screenshot([
  //     "https://www.google.com/",
  //     "https://www.google.com/",
  //     "https://www.google.com/",
  //   ]);
  //   expect(buffers.length).toBe(3);
  //   expect(buffers[0]).toBeInstanceOf(Buffer);
  //   expect(buffers[0].length).toBeGreaterThan(0);

  //   await expect(async () => {
  //     await Image.screenshot("123");
  //   }).rejects.toThrow();
  // });

  it("(static) fromFile", async () => {
    const image = await Image.fromFile("asset/rynbsd.png");
    expect(image).toBeInstanceOf(Image);
    expect(image.length).toEqual(1);

    await expect(async () => {
      await Image.fromFile("https://rynbsd.vercel.app/_next/image?url=%2Fgit.webp&w=3840&q=75");
    }).rejects.toThrow();
  });

  it("(static) fromUrl", async () => {
    const image = await Image.fromUrl("https://rynbsd.vercel.app/_next/image?url=%2Fgit.webp&w=3840&q=75");
    expect(image).toBeInstanceOf(Image);
    expect(image.length).toEqual(1);

    await expect(async () => {
      await Image.fromUrl("asset/rynbsd.png");
    }).rejects.toThrow();
  });

  it("(static) new", async () => {
    const image = await Image.fromFile("asset/rynbsd.png");
    expect(image).toBeInstanceOf(Image);
    expect(image.length).toEqual(1);

    await expect(async () => {
      await Image.new([Buffer.alloc(1)]);
    }).rejects.toThrow();
  });

  it("(static) isImage", () => {
    const image = new Image();
    const isImage = Image.isImage(image);
    expect(isImage).toBe(true);

    const object = new Object();
    const isNotImage = Image.isImage(object);
    expect(isNotImage).toBe(false);
  });
});
