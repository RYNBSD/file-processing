/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { InputFiles } from "../types/index.js";
import { Readable, type Writable } from "node:stream";
import puppeteer from "puppeteer";
export default abstract class Core {
  constructor();
  abstract get length(): number;
  abstract append(...buffers: Buffer[]): Promise<void>;
  abstract extend(...cors: unknown[]): void;
  abstract clone(): Core;
  abstract filter(): Promise<number>;
  abstract metadata(): Promise<unknown>;
  static stream(readable: Readable, writable: Writable): Writable;
  static initBrowser(options?: puppeteer.PuppeteerLaunchOptions): Promise<puppeteer.Browser>;
  /**
   * load file from path
   */
  static loadFile<T extends string>(path: T): Promise<Buffer>;
  static loadFile<T extends string[]>(path: T): Promise<Buffer[]>;
  /**
   * load file from url
   */
  static loadUrl<T extends string | URL>(url: T): Promise<Buffer>;
  static loadUrl<T extends string[] | URL[]>(url: T): Promise<Buffer[]>;
  /**
   * Convert any of supported inputs to Buffer
   */
  static toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
  static toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
  /**
   * Convert any type of inputs to Readable
   */
  static toReadable<T extends InputFiles>(input: T): Promise<Readable>;
  static toReadable<T extends InputFiles[]>(input: T): Promise<Readable[]>;
  /**
   * Convert any type of inputs into base64 | base64url
   */
  static toBase64<T extends InputFiles>(input: T, encoding?: "base64" | "base64url"): Promise<string>;
  static toBase64<T extends InputFiles[]>(input: T, encoding?: "base64" | "base64url"): Promise<string[]>;
  /**
   * Save any type of inputs into file
   */
  static toFile(
    file: {
      path: string;
      input: InputFiles;
    }[],
  ): Promise<void[]>;
}
//# sourceMappingURL=core.d.ts.map
