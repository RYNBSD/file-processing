import fs from "node:fs/promises";
import TmpFile from "../../build/helper/tmp.js";
import { imageBuffer } from "../index.js";

describe("TmpFile", () => {
  it("temp file creation", async () => {
    const video = await fs.readFile("asset/video.webm");
    const audio = await fs.readFile("asset/audio.mp3");
    const pdf = await fs.readFile("asset/pdf.pdf");
    const image = await imageBuffer();

    const tmpFile = await new TmpFile(video, audio, image, pdf).init();
    expect(tmpFile.paths).toHaveLength(4);
    
    await tmpFile.clean();
    expect(tmpFile.paths).toHaveLength(0);
  });
});
