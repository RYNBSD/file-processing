/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Readable } from "node:stream";
import type {
  BrotliCompressOptions,
  BrotliDecompressOptions,
  DeflateOptions,
  DeflateRawOptions,
  GunzipOptions,
  GzipOptions,
  InflateOptions,
  InflateRawOptions,
  TextCompressFn,
  TextCompressionMethods,
  TextCompressionOptions,
  TextCustomCallback,
  TextDecompressFn,
  TextDecompressionMethods,
  TextDecompressionOptions,
  TextSetCallback,
  UnzipOptions,
} from "../types/index.js";
import Core from "./core.js";
/**
 * At the end all files are just texts, so this class is applicable on all files
 */
export default class Text extends Core {
  private texts;
  constructor(...texts: Buffer[]);
  get length(): number;
  getTexts(): Buffer[];
  setTexts<T>(callback: TextSetCallback<T>): Promise<number>;
  append(...texts: Buffer[]): Promise<void>;
  extend(...texts: Text[]): void;
  clone(): Text;
  filter(): Promise<number>;
  /**
   * @returns - key is the character code and value is the count
   */
  private charactersMap;
  metadata(): Promise<
    {
      size: number;
      charactersMap: Map<number, number>;
    }[]
  >;
  compressAsync<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>): Promise<Buffer[]>;
  decompressAsync<T extends TextDecompressionMethods>(
    method: T,
    options?: TextDecompressionOptions<T>,
  ): Promise<Buffer[]>;
  compressStream<T extends TextCompressionMethods>(
    method: T,
    options?: TextCompressionOptions<T>,
  ): Promise<import("stream").Writable[]>;
  decompressStream<T extends TextDecompressionMethods>(
    method: T,
    options?: TextDecompressionOptions<T>,
  ): Promise<import("stream").Writable[]>;
  compressSync<T extends TextCompressionMethods>(method: T, options?: TextCompressionOptions<T>): Buffer[];
  decompressSync<T extends TextDecompressionMethods>(method: T, options?: TextDecompressionOptions<T>): Buffer[];
  custom<T>(callback: TextCustomCallback<T>): Promise<Awaited<T>[]>;
  static compress<R, T extends Buffer[] | Readable[], M extends TextCompressionMethods>(
    array: T,
    method: M,
    gzipFn: TextCompressFn<R, T[number], M>,
    deflateFn: TextCompressFn<R, T[number], M>,
    deflateRawFn: TextCompressFn<R, T[number], M>,
    brotliCompressFn: TextCompressFn<R, T[number], M>,
    options?: TextCompressionOptions<M>,
  ): R[];
  static decompress<R, T extends Buffer[] | Readable[], M extends TextDecompressionMethods>(
    array: T,
    method: M,
    gunzipFn: TextDecompressFn<R, T[number], M>,
    inflateFn: TextDecompressFn<R, T[number], M>,
    inflateRawFn: TextDecompressFn<R, T[number], M>,
    brotliDecompressFn: TextDecompressFn<R, T[number], M>,
    unzipFn: TextDecompressFn<R, T[number], M>,
    options?: TextDecompressionOptions<M>,
  ): R[];
  static filter(...texts: Buffer[]): Promise<Buffer[]>;
  static fromFile(...path: string[]): Promise<Text>;
  static fromUrl<T extends string[] | URL[]>(...url: T): Promise<Text>;
  static gzipAsync(text: Buffer, options?: GzipOptions): Promise<Buffer>;
  static deflateAsync(text: Buffer, options?: DeflateOptions): Promise<Buffer>;
  static deflateRawAsync(text: Buffer, options?: DeflateRawOptions): Promise<Buffer>;
  static brotliCompressAsync(text: Buffer, options?: BrotliCompressOptions): Promise<Buffer>;
  static gunzipAsync(text: Buffer, options?: GunzipOptions): Promise<Buffer>;
  static inflateAsync(text: Buffer, options?: InflateOptions): Promise<Buffer>;
  static inflateRawAsync(text: Buffer, options?: InflateRawOptions): Promise<Buffer>;
  static brotliDecompressAsync(text: Buffer, options?: BrotliDecompressOptions): Promise<Buffer>;
  static unzipAsync(text: Buffer, options?: UnzipOptions): Promise<Buffer>;
  static gzipStream(readable: Readable, options?: GzipOptions): import("stream").Writable;
  static deflateStream(readable: Readable, options?: DeflateOptions): import("stream").Writable;
  static deflateRawStream(readable: Readable, options?: DeflateRawOptions): import("stream").Writable;
  static brotliCompressStream(readable: Readable, options?: BrotliCompressOptions): import("stream").Writable;
  static gunzipStream(readable: Readable, options?: GunzipOptions): import("stream").Writable;
  static inflateStream(readable: Readable, options?: InflateOptions): import("stream").Writable;
  static inflateRawStream(readable: Readable, options?: InflateRawOptions): import("stream").Writable;
  static brotliDecompressStream(readable: Readable, options?: BrotliDecompressOptions): import("stream").Writable;
  static unzipStream(readable: Readable, options?: UnzipOptions): import("stream").Writable;
  static gzipSync(buffer: Buffer, options?: GzipOptions): Buffer;
  static deflateSync(buffer: Buffer, options?: DeflateOptions): Buffer;
  static deflateRawSync(buffer: Buffer, options?: DeflateRawOptions): Buffer;
  static brotliCompressSync(buffer: Buffer, options?: BrotliCompressOptions): Buffer;
  static gunzipSync(buffer: Buffer, options?: GunzipOptions): Buffer;
  static inflateSync(buffer: Buffer, options?: InflateOptions): Buffer;
  static inflateRawSync(buffer: Buffer, options?: InflateRawOptions): Buffer;
  static brotliDecompressSync(buffer: Buffer, options?: BrotliDecompressOptions): Buffer;
  static unzipSync(buffer: Buffer, options?: UnzipOptions): Buffer;
}
//# sourceMappingURL=text.d.ts.map
