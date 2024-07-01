import type { FfmpegCommand } from "fluent-ffmpeg";

export type AVSetCallback<T> = (av: Buffer, indeX: number) => Promise<T> | T;

export type AVCustomCallback<T> = (command: FfmpegCommand, index: number) => Promise<T> | T;

export type AVCallback<T> = (command: FfmpegCommand) => Promise<T> | T;
