import type { FileTypeResult, MimeType, FileExtension } from "file-type";
import type { InputFiles } from "../types/index.js";
import { Mutex } from "async-mutex";
import isFile, { Node as isFileNode } from "@ryn-bsd/is-file";
import Core from "../core/core.js";

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
    const buffer = await Core.toBuffer(this.input);
    const result = await isFile.isCustom(buffer, me);
    return result.filter((file) => file.valid).map((file) => file.value) as Buffer[];
  }

  static async filter(...input: InputFiles[]) {
    const buffer = await Core.toBuffer(input);

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
      buffer.map(async (buffer) => {
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
      }),
    );

    return files;
  }

  static async type<T extends InputFiles>(files: T): Promise<FileTypeResult | undefined>;
  static async type<T extends InputFiles[]>(files: T): Promise<(FileTypeResult | undefined)[]>;
  static async type<T extends InputFiles | InputFiles[]>(files: T) {
    if (Array.isArray(files)) return Promise.all(files.map((file) => FilterFile.type(file)));
    const buffer = await Core.toBuffer(files);
    return isFileNode.type(buffer);
  }

  static async mime<T extends InputFiles>(files: T): Promise<MimeType | undefined>;
  static async mime<T extends InputFiles[]>(files: T): Promise<(MimeType | undefined)[]>;
  static async mime<T extends InputFiles | InputFiles[]>(files: T) {
    if (Array.isArray(files)) return Promise.all(files.map((file) => FilterFile.mime(file)));
    const type = await FilterFile.type(files);
    return type?.mime;
  }

  static async extension<T extends InputFiles>(files: T): Promise<FileExtension | undefined>;
  static async extension<T extends InputFiles[]>(files: T): Promise<(FileExtension | undefined)[]>;
  static async extension<T extends InputFiles | InputFiles[]>(files: T) {
    if (Array.isArray(files)) return Promise.all(files.map((file) => FilterFile.extension(file)));
    const type = await FilterFile.type(files);
    return type?.ext;
  }
}
