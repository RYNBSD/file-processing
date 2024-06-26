import type { Stream, Readable } from "node:stream";

export type InputFiles = string | URL | Uint8Array | ArrayBuffer | SharedArrayBuffer | Buffer | Stream | Readable;

export type * from "./image.ts";
export type * from "./text.js";
export type * from "./pdf.js";
export type * from "./csv.js";
export type * from "./av.js";
