import type {
  BrotliCompressOptions,
  BrotliDecompressOptions,
  DeflateOptions,
  DeflateRawOptions,
  GunzipOptions,
  GzipOptions,
  InflateOptions,
  InflateRawOptions,
  TextCompressionMethods,
  TextCompressionOptions,
  TextCustomCallback,
  TextDecompressionMethods,
  TextDecompressionOptions,
  TextSetCallback,
} from "../types/index.js";
import zlib from "node:zlib";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";

/**
 * At the end all files are just texts, so this class is applicable on all files
 */
export default class Text extends Core {
  private texts: Buffer[];

  constructor(...texts: Buffer[]) {
    super();
    this.texts = texts;
  }

  getTexts() {
    return [...this.texts];
  }

  async setTexts<T>(callback: TextSetCallback<T>) {
    const texts = await Promise.all(
      this.texts.map((text, index) => callback(text, index))
    );
    const filteredTexts = texts.filter((text) =>
      Buffer.isBuffer(text)
    ) as Buffer[];
    this.texts = filteredTexts;
  }

  async appendTexts(...texts: Buffer[]) {
    const filteredTexts = await Text.filter(...texts);
    this.texts.push(...filteredTexts);
  }

  extendTexts(...texts: Text[]) {
    texts.forEach((text) => {
      this.texts.push(...text.getTexts());
    });
  }

  override clone() {
    return new Text(...this.texts);
  }

  override async filter() {
    this.texts = await Text.filter(...this.texts);
    return this.texts.length;
  }

  override async check() {
    const texts = await Text.filter(...this.texts);
    if (texts.length === 0)
      throw new TypeError(`${Text.name}: Files must be of type text`);
  }

  override async metadata() {
    return Promise.all(
      this.texts.map(async (text) => ({
        size: text.length,
      }))
    );
  }

  async compress<T extends TextCompressionMethods>(
    method: T,
    options?: TextCompressionOptions<T>
  ) {
    return Promise.all(
      this.texts.map((text) => {
        switch (method) {
          case "gzip":
            return Text.gzipAsync(text, options);
          case "deflate":
            return Text.deflateAsync(text, options);
          case "deflate-raw":
            return Text.deflateRawAsync(text, options);
          case "brotli-compress":
            return Text.brotliCompressAsync(text, options);
          default:
            throw new TypeError(`${Text.name}: Invalid compression method`);
        }
      })
    );
  }

  async decompress<T extends TextDecompressionMethods>(
    method: T,
    options?: TextDecompressionOptions<T>
  ) {
    return Promise.all(
      this.texts.map((text) => {
        switch (method) {
          case "gunzip":
            return Text.gunzipAsync(text, options);
          case "inflate":
            return Text.inflateAsync(text, options);
          case "inflate-raw":
            return Text.inflateRawAsync(text, options);
          case "brotli-decompress":
            return Text.brotliDecompressAsync(text, options);
          default:
            throw new TypeError(`${Text.name}: Invalid decompression method`);
        }
      })
    );
  }

  async custom<T>(callback: TextCustomCallback<T>): Promise<Awaited<T>[]> {
    return Promise.all(this.texts.map(callback));
  }

  static async filter(...texts: Buffer[]) {
    return new FilterFile(...texts).text();
  }

  static async fromFile(path: string) {
    const buffer = await Core.loadFile(path);
    return new Text(buffer);
  }

  static async fromUrl<T extends string | URL>(url: T) {
    const buffer = await Core.loadUrl(url);
    return new Text(buffer);
  }

  static async gzipAsync(text: Buffer, options: GzipOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.gzip(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async deflateAsync(text: Buffer, options: DeflateOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.deflate(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async deflateRawAsync(text: Buffer, options: DeflateRawOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.deflateRaw(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async brotliCompressAsync(
    text: Buffer,
    options: BrotliCompressOptions = {}
  ) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.brotliCompress(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async gunzipAsync(text: Buffer, options: GunzipOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.gunzip(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async inflateAsync(text: Buffer, options: InflateOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.inflate(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async inflateRawAsync(text: Buffer, options: InflateRawOptions = {}) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.inflateRaw(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }

  static async brotliDecompressAsync(
    text: Buffer,
    options: BrotliDecompressOptions = {}
  ) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.brotliDecompress(text, options, (err, buf) => {
        if (err) return reject(err);
        resolve(buf);
      });
    });
  }
}
