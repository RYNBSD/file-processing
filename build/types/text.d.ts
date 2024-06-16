/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type zlib from "node:zlib";
export type TextCompressionMethods = "gzip" | "deflate" | "deflate-raw" | "brotli-compress";
export type GzipOptions = Parameters<typeof zlib.gzipSync>[1];
export type DeflateOptions = Parameters<typeof zlib.deflateSync>[1];
export type DeflateRawOptions = Parameters<typeof zlib.deflateRawSync>[1];
export type BrotliCompressOptions = Parameters<typeof zlib.brotliCompressSync>[1];
export type TextCompressionOptions<T> = T extends "gzip" ? GzipOptions : T extends "deflate" ? DeflateOptions : T extends "deflate-raw" ? DeflateRawOptions : T extends "brotli" ? BrotliCompressOptions : never;
export type TextDecompressionMethods = "gunzip" | "inflate" | "inflate-raw" | "brotli-decompress";
export type GunzipOptions = Parameters<typeof zlib.gunzipSync>[1];
export type InflateOptions = Parameters<typeof zlib.inflateSync>[1];
export type InflateRawOptions = Parameters<typeof zlib.inflateRawSync>[1];
export type BrotliDecompressOptions = Parameters<typeof zlib.brotliDecompressSync>[1];
export type TextDecompressionOptions<T extends TextDecompressionMethods> = T extends "gunzip" ? GunzipOptions : T extends "inflate" ? InflateOptions : T extends "inflate-raw" ? InflateRawOptions : T extends "brotli-decompress" ? BrotliDecompressOptions : never;
export type TextSetCallback<T> = (text: Buffer, index: number) => Promise<T> | T;
export type TextCustomCallback<T> = (text: ArrayBuffer, index: number) => Promise<T> | T;
//# sourceMappingURL=text.d.ts.map