/// <reference types="node" resolution-mode="require"/>
import type { FfmpegCommand } from "fluent-ffmpeg";
import type { TmpFile } from "../helper/index.js";
export type AVSetCallback<T> = (av: Buffer, indeX: number) => Promise<T> | T;
export type AVCustomCallback<T> = (command: FfmpegCommand, tmpFile: Omit<TmpFile, "init" | "clean">, index: number) => Promise<T> | T;
export type AVCallback<T> = (command: FfmpegCommand) => Promise<T> | T;
//# sourceMappingURL=av.d.ts.map