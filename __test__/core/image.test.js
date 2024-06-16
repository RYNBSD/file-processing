import Image from "../../build/core/image.js";
import { imageBuffer } from "../index.js";

describe("Image", () => {
  it("set/get/append/extend/clone", async () => {
    const image = new Image(Buffer.alloc(0));
    expect(image.getImages()).toHaveLength(1);

    const buffer = await imageBuffer();
    await image.appendImages(Buffer.alloc(0), buffer);
    expect(image.getImages()).toHaveLength(2);

    await image.setImages((image) => image.toString());
    expect(image.getImages()).toHaveLength(0);

    image.extendImages(new Image(Buffer.alloc(0)));
    expect(image.getImages()).toHaveLength(1);

    expect(image.clone()).toBeInstanceOf(Image);
  });

  it("check", async () => {
    const buffer = await imageBuffer();

    await new Image(buffer).check();
    expect(true).toBe(true);

    await expect(async () => {
      await new Image(Buffer.alloc(1)).check();
    }).rejects.toThrow(TypeError);
  });

  it("metadata", async () => {
    const buffer = await imageBuffer();

    const metadata = await new Image(buffer).metadata();
    expect(metadata).toHaveLength(1);

    await expect(async () => {
      await new Image(Buffer.alloc(1)).metadata();
    }).rejects.toThrow();
  });

  it("convert", async () => {
    const buffer = await imageBuffer();

    const convert = await new Image(buffer).convert("jpeg");
    expect(convert).toHaveLength(1);

    await expect(async () => {
      await new Image(Buffer.alloc(1)).convert();
    }).rejects.toThrow();
  });

  it("custom", async () => {
    const buffer = await imageBuffer();

    const custom = await new Image(buffer).custom((sharp) => {
      return sharp
        .jpeg()
        .resize({ width: 1280, height: 720, fit: "fill" })
        .blur()
        .toBuffer();
    });
    expect(custom).toHaveLength(1);
  });
});
