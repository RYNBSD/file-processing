import fs from "node:fs";
import AV from "../../build/core/av.js";

describe("AV", () => {
  it("metadata", async () => {
    const videoStream = await fs.promises.readFile("asset/video.webm");

    const videoMetadata = await new AV(videoStream).metadata();
    expect(videoMetadata).toHaveLength(1);

    const audioStream = await fs.promises.readFile("asset/audio.mp3");

    const audioMetadata = await new AV(audioStream).metadata();
    expect(audioMetadata).toHaveLength(1);

    await expect(async () => {
      await new AV(Buffer.alloc(1)).metadata();
    }).rejects.toThrow();
  });

  it("custom", async () => {
    const videos = ["asset/vide1.avi", "asset/vide2.avi"];
    const read = await fs.promises.readFile("asset/video.webm");

    const writeBuffer = fs.createWriteStream(videos[0]);
    await new AV(read).custom("buffer", (command) => {
      return new Promise((resolve, reject) => {
        command
          .preset("divx")
          .on("end", resolve)
          .on("error", reject)
          .pipe(writeBuffer, { end: true });
      });
    });
    expect(true).toBe(true);

    const writeStream = fs.createWriteStream(videos[1]);
    await new AV(read).custom("stream", (command) => {
      return new Promise((resolve, reject) => {
        command
          .preset("divx")
          .on("end", resolve)
          .on("error", reject)
          .pipe(writeStream, { end: true });
      });
    });
    expect(true).toBe(true);
  });

  it("(static) stream", async () => {
    const videos = ["asset/video-stream.flv"];
    const read = fs.createReadStream("asset/video.webm");
    const write = fs.createWriteStream(videos[0]);
    await AV.stream(read, (command) =>
      command.format("flv").pipe(write, { end: true })
    );
    expect(true).toBe(true);
  });

  it("(static) buffer", async () => {
    const videos = ["asset/video-buffer.flv"];
    const read = await fs.promises.readFile("asset/video.webm");
    const write = fs.createWriteStream(videos[0]);
    await AV.buffer(read, (command) => {
      command.format("flv").pipe(write, { end: true });
    });
    expect(true).toBe(true);
  });
});

describe("Video", () => {
  it("check", async () => {
    const read = await fs.promises.readFile("asset/video.webm");
    await new AV(read).video();
    expect(true).toBe(true);

    await expect(async () => {
      await new AV(Buffer.alloc(1)).video();
    }).rejects.toThrow(TypeError);
  });

  it("convert", async () => {
    const videos = ["asset/video.flv"];
    const read = await fs.promises.readFile("asset/video.webm");
    const video = await new AV(read).video();

    const buffer = await video.convert("buffer", "flv");
    expect(buffer).toHaveLength(1);

    const writer = fs.createWriteStream(videos[0]);
    await video.convert("stream", "flv", writer);
    expect(true).toBe(true);
  });
});

describe("Audio", () => {
  it("check", async () => {
    const audio = await fs.promises.readFile("asset/audio.mp3");
    await new AV(audio).audio();

    await expect(async () => {
      await new AV(Buffer.alloc(1)).audio();
    }).rejects.toThrow(TypeError);
  });

  it("convert", async () => {
    const audios = ["asset/audio-convert.wav"];
    const read = await fs.promises.readFile("asset/audio.mp3");
    const audio = await new AV(read).audio();

    const buffer = await audio.convert("buffer", "wav");
    expect(buffer).toHaveLength(1);

    const writer = fs.createWriteStream(audios[0]);
    await audio.convert("stream", "wav", writer);
    expect(true).toBe(true);
  });
});
