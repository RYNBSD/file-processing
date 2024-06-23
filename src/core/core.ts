import type { InputFiles } from "../types/index.js";
import { Readable, type Writable } from "node:stream";
import { isAnyArrayBuffer, isUint8Array } from "node:util/types";
import { readFile } from "node:fs/promises";
import path from "node:path";
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
import fetch from "node-fetch";
import isBase64 from "is-base64";
import puppeteer from "puppeteer";
import { isUrl } from "../helper/index.js";

export default abstract class Core {
  constructor() {}

  abstract get length(): number;

  abstract append(...buffers: Buffer[]): Promise<void>;
  abstract extend(...cors: unknown[]): void;
  abstract clone(): Core;

  abstract filter(): Promise<number>;
  abstract metadata(): Promise<unknown>;

  // abstract stream(): Promise<void>;

  static stream(readable: Readable, writable: Writable) {
    return readable.pipe(writable);
  }

  static initBrowser() {
    return puppeteer.launch();
  }

  /**
   * load file from path
   */
  static async loadFile<T extends string>(path: T): Promise<Buffer>;
  static async loadFile<T extends string[]>(path: T): Promise<Buffer[]>;
  static async loadFile<T extends string | string>(path: T) {
    if (Array.isArray(path))
      return Promise.all(path.map((p) => Core.loadFile(p)));
    return readFile(path);
  }

  /**
   * load file from url
   */
  static async loadUrl<T extends string | URL>(url: T): Promise<Buffer>;
  static async loadUrl<T extends string[] | URL[]>(url: T): Promise<Buffer[]>;
  static async loadUrl<T extends string | URL | string[] | URL[]>(url: T) {
    if (Array.isArray(url))
      return Promise.all(url.map((u) => Core.loadUrl(u)));

    const res = await fetch(url);
    if (!res.ok) throw new Error(`${Core.name}: Can't fetch (${url})`);
    const arrayBuffer = await res.arrayBuffer();
    return array2buffer(arrayBuffer);
  }

  /**
   * Convert any of supported inputs to Buffer
   */
  static async toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
  static async toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
  static async toBuffer<T extends InputFiles | InputFiles[]>(input: T) {
    if (Array.isArray(input))
      return Promise.all(input.map((i) => Core.toBuffer(i)));

    if (Buffer.isBuffer(input)) return input;
    else if (isUrl(input)) return Core.loadUrl(input);
    else if (isUint8Array(input)) return uint8array2buffer(input);
    else if (isAnyArrayBuffer(input)) return array2buffer(input);
    else if (isStream(input)) return stream2buffer(input);
    else if (isReadableStream(input)) return readablestream2buffer(input);
    else if (isReadable(input) && Readable.isReadable(input))
      return readable2buffer(input);
    else if (typeof input === "string") {
      if (isUrl(input)) return Core.loadUrl(input);
      else if (path.isAbsolute(input)) return Core.loadFile(input);
      else if (isBase64(input, { allowEmpty: false }))
        return Buffer.from(input, "base64");
      return string2buffer(input, false);
    }
    return any2buffer(input);
  }

  /**
   * Convert any type of inputs to Readable
   */
  static async toReadable<T extends InputFiles>(input: T): Promise<Readable>;
  static async toReadable<T extends InputFiles[]>(
    input: T
  ): Promise<Readable[]>;
  static async toReadable<T extends InputFiles | InputFiles[]>(input: T) {
    if (Array.isArray(input))
      return Promise.all(input.map((i) => Core.toReadable(i)));

    if (isReadable(input) && Readable.isReadable(input)) return input;

    const buffer = await Core.toBuffer(input);
    return buffer2readable(buffer);
  }

  /**
   * Convert any type of inputs into base64 | base64url
   */
  static async toBase64<T extends InputFiles>(
    input: T,
    encoding?: "base64" | "base64url"
  ): Promise<string>;
  static async toBase64<T extends InputFiles[]>(
    input: T,
    encoding?: "base64" | "base64url"
  ): Promise<string[]>;
  static async toBase64<T extends InputFiles | InputFiles[]>(
    input: T,
    encoding: "base64" | "base64url" = "base64"
  ) {
    if (Array.isArray(input))
      return Promise.all(input.map((i) => Core.toBase64(i)));

    if (typeof input === "string" && isBase64(input)) return input;

    const buffer = await Core.toBuffer(input);
    return buffer.toString(encoding);
  }
}
