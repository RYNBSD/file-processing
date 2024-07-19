import { isAnyArrayBuffer, isUint8Array } from "node:util/types";
import { Readable } from "node:stream";
import fs from "node:fs";
import { InputFiles } from "../types/index.js";
import { isUrl } from "./fn.js";
import {
  any2buffer,
  array2buffer,
  buffer2readable,
  isReadable,
  isReadableStream,
  isStream,
  readable2buffer,
  readablestream2buffer,
  stream2buffer,
  string2buffer,
  uint8array2buffer,
} from "@ryn-bsd/from-buffer-to";
import isBase64 from "is-base64";
import { loadFile, loadUrl } from "./loader.js";

/**
 * @param input - any type of supported inputs
 *
 * @example
 * ```js
 *  toBuffer("cnluYnNk")
 *  toBuffer("/file.text")
 *  toBuffer("https://example.com/file.text")
 * ```
 */
export async function toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
export async function toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
export async function toBuffer<T extends InputFiles | InputFiles[]>(input: T) {
  if (Array.isArray(input)) return Promise.all(input.map((i) => toBuffer(i)));

  if (Buffer.isBuffer(input)) return input;
  else if (isUrl(input)) return loadUrl(input);
  else if (isUint8Array(input)) return uint8array2buffer(input);
  else if (isAnyArrayBuffer(input)) return array2buffer(input);
  else if (isStream(input)) return stream2buffer(input);
  else if (isReadableStream(input)) return readablestream2buffer(input);
  else if (isReadable(input) && Readable.isReadable(input)) return readable2buffer(input);
  else if (typeof input === "string") {
    const fileStat = await fs.promises.stat(input);
    if (fileStat.isFile()) return loadFile(input);
    else if (isBase64(input, { allowEmpty: false })) return Buffer.from(input, "base64");
    return string2buffer(input, false);
  }
  return any2buffer(input);
}

/**
 * Convert any type of inputs to Readable
 *
 * @example
 * ```js
 *  toReadable("cnluYnNk")
 *  toReadable("/file.text")
 *  toReadable("https://example.com/file.text")
 * ```
 */
export async function toReadable<T extends InputFiles>(input: T): Promise<Readable>;
export async function toReadable<T extends InputFiles[]>(input: T): Promise<Readable[]>;
export async function toReadable<T extends InputFiles | InputFiles[]>(input: T) {
  if (Array.isArray(input)) return Promise.all(input.map((i) => toReadable(i)));
  if (isReadable(input) && Readable.isReadable(input)) return input;
  const buffer = await toBuffer(input);
  return buffer2readable(buffer);
}

/**
 * Convert any type of inputs into base64 | base64url
 *
 * @example
 * ```js
 *  toBase64("cnluYnNk")
 *  toBase64("/file.text")
 *  toBase64("https://example.com/file.text")
 * ```
 */
export async function toBase64<T extends InputFiles>(input: T, encoding?: "base64" | "base64url"): Promise<string>;
export async function toBase64<T extends InputFiles[]>(input: T, encoding?: "base64" | "base64url"): Promise<string[]>;
export async function toBase64<T extends InputFiles | InputFiles[]>(
  input: T,
  encoding: "base64" | "base64url" = "base64",
) {
  if (Array.isArray(input)) return Promise.all(input.map((i) => toBase64(i)));
  if (typeof input === "string" && isBase64(input)) return input;
  const buffer = await toBuffer(input);
  return buffer.toString(encoding);
}

/**
 * Save any type of inputs into file
 *
 * @example
 * ```js
 *  toFile(
 *    [
 *      {
 *        path: "where-to-store.txt",
 *        input: Buffer.alloc(1)
 *      }
 *    ]
 *  )
 * ```
 */
export async function toFile(file: { path: string; input: InputFiles }[]) {
  await Promise.all(
    file.map(async (f) => {
      const buffer = await toBuffer(f.input);
      return fs.promises.writeFile(f.path, buffer);
    }),
  );
}
