/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Stream, Readable } from "node:stream";
import "./global.js";
export type InputFiles = string | URL | Uint8Array | ArrayBuffer | SharedArrayBuffer | Buffer | Stream | Readable;
export type * from "./image.ts";
export type * from "./text.js";
export type * from "./pdf.js";
export type * from "./csv.js";
export type * from "./av.js";
//# sourceMappingURL=index.d.ts.map