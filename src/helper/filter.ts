import type { InputFiles } from "../types/index.js";
import { Mutex } from "async-mutex";
import isFile from "@ryn-bsd/is-file";
import { input2buffer } from "./fn.js";

/**
 * Easy and fast way to filter bunche of files
 */
export default class FilterFile {
  private readonly input: InputFiles[];

  constructor(...input: InputFiles[]) {
    this.input = input;
  }

  async application() {
    const { applications } = await FilterFile.filter(...this.input);
    return applications;
  }

  async audio() {
    const { audios } = await FilterFile.filter(...this.input);
    return audios;
  }

  async font() {
    const { fonts } = await FilterFile.filter(...this.input);
    return fonts;
  }

  async image() {
    const { images } = await FilterFile.filter(...this.input);
    return images;
  }

  async model() {
    const { models } = await FilterFile.filter(...this.input);
    return models;
  }

  async text() {
    const { texts } = await FilterFile.filter(...this.input);
    return texts;
  }

  async video() {
    const { videos } = await FilterFile.filter(...this.input);
    return videos;
  }

  /**
   * Filter custom file
   * @param me - mime extension
   */
  async custom(me: string) {
    const buffer = await Promise.all(
      this.input.map((input) => input2buffer(input))
    );
    const filteredBuffer = buffer.filter((buf) =>
      Buffer.isBuffer(buf)
    ) as Buffer[];
    const result = await isFile.isCustom(filteredBuffer, me);
    return result
      .filter((file) => file.valid)
      .map((file) => file.value) as Buffer[];
  }

  static async filter(...input: InputFiles[]) {
    const buffer = await Promise.all(input.map((input) => input2buffer(input)));
    const filteredBuffer = buffer.filter((buf) =>
      Buffer.isBuffer(buf)
    ) as Buffer[];

    const mutexes = {
      applications: new Mutex(),
      audios: new Mutex(),
      fonts: new Mutex(),
      images: new Mutex(),
      models: new Mutex(),
      texts: new Mutex(),
      videos: new Mutex(),
    };

    const files: Record<keyof typeof mutexes, Buffer[]> = {
      applications: [],
      audios: [],
      fonts: [],
      images: [],
      models: [],
      texts: [],
      videos: [],
    };

    await Promise.all(
      filteredBuffer.map(async (buffer) => {
        if (await isFile.isApplication(buffer)) {
          const release = await mutexes.applications.acquire();
          files.applications.push(buffer);
          release();
        } else if (await isFile.isAudio(buffer)) {
          const release = await mutexes.audios.acquire();
          files.audios.push(buffer);
          release();
        } else if (await isFile.isFont(buffer)) {
          const release = await mutexes.fonts.acquire();
          files.fonts.push(buffer);
          release();
        } else if (await isFile.isImage(buffer)) {
          const release = await mutexes.images.acquire();
          files.images.push(buffer);
          release();
        } else if (await isFile.isModel(buffer)) {
          const release = await mutexes.models.acquire();
          files.models.push(buffer);
          release();
        } else if (await isFile.isText(buffer)) {
          const release = await mutexes.texts.acquire();
          files.texts.push(buffer);
          release();
        } else if (await isFile.isVideo(buffer)) {
          const release = await mutexes.videos.acquire();
          files.videos.push(buffer);
          release();
        }
      })
    );

    return files;
  }
}
