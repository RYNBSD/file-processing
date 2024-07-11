import fs from "node:fs";
import { Video, Audio } from "../../build/core/av/index.js";
import { TmpFile } from "../../build/helper/index.js";
import path from "node:path";

describe("AV", () => {
  it("metadata", async () => {
    const video = await fs.promises.readFile("asset/video.webm");

    const videoMetadata = await new Video(video).metadata();
    expect(videoMetadata).toHaveLength(1);
  });

  it("custom", async () => {
    const read = await fs.promises.readFile("asset/video.webm");
    const tmpFile = await new TmpFile().init();

    const buffer = await new Video(read).custom((command) => {
      const output = path.join(tmpFile.tmp.path, TmpFile.generateFileName("avi"));
      return new Promise((resolve, reject) => {
        command
          .preset("divx")
          .on("end", () => {
            Video.loadFile(output).then(resolve).catch(reject);
          })
          .on("error", reject)
          .output(output, { end: true })
          .run();
      });
    });

    await tmpFile.clean();
    expect(buffer).toHaveLength(1);
    expect(buffer[0]).toBeInstanceOf(Buffer);
  });

  it("split", async () => {
    const buffer = await Video.loadFile("asset/video.webm");
    const video = await Video.new([buffer]);

    const splits = await video.spilt(10);
    expect(splits).toHaveLength(1);
    expect(splits[0]).toHaveLength(2);
    expect(splits[0][0]).toBeInstanceOf(Buffer);
    expect(splits[0][1]).toBeInstanceOf(Buffer);
  });

  it("convert", async () => {
    const read = await fs.promises.readFile("asset/video.webm");
    const buffer = await new Video(read).convert("mp4");
    expect(buffer).toHaveLength(1);
    expect(buffer[0]).toBeInstanceOf(Buffer);
  });

  // it("(static) stream", async () => {
  //   const videos = ["asset/video-stream.flv"];
  //   const read = fs.createReadStream("asset/video.webm");
  //   const write = fs.createWriteStream(videos[0]);
  //   await Video.stream(read, (command) =>
  //     command.format("flv").pipe(write, { end: true })
  //   );
  //   expect(true).toBe(true);
  // });
});

describe("Video", () => {
  it("set/get/append/extend/clone", async () => {
    const video = new Video(Buffer.alloc(0));
    expect(video.getVideos()).toHaveLength(1);

    const buffer = await Video.loadFile("asset/video.webm");
    await video.append(Buffer.alloc(0), buffer);
    expect(video.getVideos()).toHaveLength(2);

    await video.setVideos((video) => video.toString());
    expect(video.getVideos()).toHaveLength(0);

    video.extend(new Video(Buffer.alloc(0)));
    expect(video.getVideos()).toHaveLength(1);

    expect(video.clone()).toBeInstanceOf(Video);
  });

  it("filter", async () => {
    const buffer = await Video.loadFile("asset/video.webm");
    const video = new Video(buffer, Buffer.alloc(0));
    const length = await video.filter();
    expect(length).toBe(1);
  });

  it("(static) fromFile", async () => {
    const video = await Video.fromFile("asset/video.webm");
    expect(video).toBeInstanceOf(Video);
    expect(video.length).toEqual(1);
  });

  it("(static) fromUrl", async () => {
    const video = await Video.fromUrl("https://videos.pexels.com/video-files/2802271/2802271-hd_1920_1080_30fps.mp4");
    expect(video).toBeInstanceOf(Video);
    expect(video.length).toEqual(1);
  });

  it("(static) new", async () => {
    const buffer = await Video.loadFile("asset/video.webm");
    const video = await Video.new([buffer]);
    expect(video).toBeInstanceOf(Video);
    expect(video.length).toEqual(1);

    await expect(async () => {
      await Video.new([Buffer.alloc(1)]);
    }).rejects.toThrow(Error);
  });

  it("(static) isVideo", () => {
    const video = new Video();
    const isVideo = Video.isVideo(video);
    expect(isVideo).toBe(true);

    const object = new Object();
    const isNotVideo = Video.isVideo(object);
    expect(isNotVideo).toBe(false);
  });
});

describe("Audio", () => {
  it("set/get/append/extend/clone", async () => {
    const audio = new Audio(Buffer.alloc(0));
    expect(audio.getAudios()).toHaveLength(1);

    const buffer = await Audio.loadFile("asset/audio.mp3");
    await audio.append(Buffer.alloc(0), buffer);
    expect(audio.getAudios()).toHaveLength(2);

    await audio.setAudios((audio) => audio.toString());
    expect(audio.getAudios()).toHaveLength(0);

    audio.extend(new Audio(Buffer.alloc(0)));
    expect(audio.getAudios()).toHaveLength(1);

    expect(audio.clone()).toBeInstanceOf(Audio);
  });

  it("filter", async () => {
    const buffer = await Audio.loadFile("asset/audio.mp3");
    const audio = new Audio(buffer, Buffer.alloc(0));
    const length = await audio.filter();
    expect(length).toBe(1);
  });

  it("(static) fromFile", async () => {
    const audio = await Audio.fromFile("asset/audio.mp3");
    expect(audio).toBeInstanceOf(Audio);
    expect(audio.length).toEqual(1);
  });

  it("(static) fromUrl", async () => {
    const audio = await Audio.fromUrl("http://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a");
    expect(audio).toBeInstanceOf(Audio);
    expect(audio.length).toEqual(1);
  });

  it("(static) new", async () => {
    const buffer = await Audio.loadFile("asset/audio.mp3");
    const audio = await Audio.new([buffer]);
    expect(audio).toBeInstanceOf(Audio);
    expect(audio.length).toEqual(1);

    await expect(async () => {
      await Audio.new([Buffer.alloc(1)]);
    }).rejects.toThrow(Error);
  });

  it("(static) isAudio", () => {
    const audio = new Audio();
    const isAudio = Audio.isAudio(audio);
    expect(isAudio).toBe(true);

    const object = new Object();
    const isNotAudio = Audio.isAudio(object);
    expect(isNotAudio).toBe(false);
  });
});
