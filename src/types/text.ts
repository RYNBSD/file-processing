import type { Readable } from "node:stream";
import type zlib from "node:zlib";

export type TextCompressionMethods = "gzip" | "deflate" | "deflate-raw" | "brotli-compress";

export type GzipOptions = Parameters<typeof zlib.gzipSync>[1];

export type DeflateOptions = Parameters<typeof zlib.deflateSync>[1];

export type DeflateRawOptions = Parameters<typeof zlib.deflateRawSync>[1];

export type BrotliCompressOptions = Parameters<typeof zlib.brotliCompressSync>[1];

export type TextCompressionOptions<T> = T extends "gzip"
  ? GzipOptions
  : T extends "deflate"
    ? DeflateOptions
    : T extends "deflate-raw"
      ? DeflateRawOptions
      : T extends "brotli-compress"
        ? BrotliCompressOptions
        : never;

export type TextCompressFn<R, T extends Buffer | Readable, M extends TextCompressionMethods> = (
  text: T,
  options?: TextCompressionOptions<M>,
) => R;

export type TextDecompressionMethods = "gunzip" | "inflate" | "inflate-raw" | "brotli-decompress" | "unzip";

export type GunzipOptions = Parameters<typeof zlib.gunzipSync>[1];

export type InflateOptions = Parameters<typeof zlib.inflateSync>[1];

export type InflateRawOptions = Parameters<typeof zlib.inflateRawSync>[1];

export type BrotliDecompressOptions = Parameters<typeof zlib.brotliDecompressSync>[1];

export type UnzipOptions = Parameters<typeof zlib.unzipSync>[1];

export type TextDecompressionOptions<T extends TextDecompressionMethods> = T extends "gunzip"
  ? GunzipOptions
  : T extends "inflate"
    ? InflateOptions
    : T extends "inflate-raw"
      ? InflateRawOptions
      : T extends "brotli-decompress"
        ? BrotliDecompressOptions
        : T extends "unzip"
          ? UnzipOptions
          : never;

export type TextDecompressFn<R, T extends Buffer | Readable, M extends TextDecompressionMethods> = (
  text: T,
  options?: TextDecompressionOptions<M>,
) => R;

export type TextSetCallback<T> = (text: Buffer, index: number) => Promise<T> | T;

export type TextCustomCallback<T> = (text: ArrayBuffer, index: number) => Promise<T> | T;
