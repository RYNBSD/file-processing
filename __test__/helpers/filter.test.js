import fs from "node:fs/promises";
import FilterFile from "../../build/helper/filter.js";
import { imageBuffer } from "../index.js";

async function testFilter(filter, length) {
  const video = await fs.readFile("asset/video.webm");
  const audio = await fs.readFile("asset/audio.mp3");
  const pdf = await fs.readFile("asset/pdf.pdf");
  const image = await imageBuffer();
  
  const filterFn = new FilterFile(pdf, audio, video, image)[filter];
  const filters = await filterFn();
  expect(filters).toHaveLength(length);
  }
  
  describe("Filter File", () => {
    it("(static) filter", async () => {
      const video = await fs.readFile("asset/video.webm");
      const audio = await fs.readFile("asset/audio.mp3");
      const pdf = await fs.readFile("asset/pdf.pdf");
      const image = await imageBuffer();

    const filter = await FilterFile.filter(video, audio, pdf, image);

    expect(filter.applications).toHaveLength(1);
    expect(filter.audios).toHaveLength(1);
    expect(filter.fonts).toHaveLength(0);
    expect(filter.images).toHaveLength(1);
    expect(filter.models).toHaveLength(0);
    expect(filter.texts).toHaveLength(0);
    expect(filter.videos).toHaveLength(1);
  });

  it("application", async () => {
    testFilter("application", 1);
  });

  it("audio", async () => {
    testFilter("audio", 1);
  });

  it("font", async () => {
    testFilter("font", 0);
  });

  it("image", async () => {
    testFilter("image", 1);
  });

  it("model", async () => {
    testFilter("model", 0);
  });

  it("text", async () => {
    testFilter("text", 0);
  });

  it("video", async () => {
    testFilter("video", 0);
  });
});
