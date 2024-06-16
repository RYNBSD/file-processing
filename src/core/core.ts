import { readFile } from "node:fs/promises";
import { array2buffer } from "@ryn-bsd/from-buffer-to";
import fetch from "node-fetch";

export default abstract class Core {
  constructor() {}

  abstract filter(): Promise<number>;
  abstract check(): Promise<void>;
  abstract clone(): Core;

  abstract metadata(): Promise<unknown>;

  /**
   * load file from path
   */
  static async loadFile(path: string) {
    return readFile(path);
  }

  /**
   * load file from url
   */
  static async loadUrl<T extends string | URL>(url: T) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${Core.name}: Can't fetch the text (${url})`);

    const arrayBuffer = await res.arrayBuffer();
    return array2buffer(arrayBuffer);
  }
}
