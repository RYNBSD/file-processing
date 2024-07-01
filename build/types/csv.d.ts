/// <reference types="node" resolution-mode="require"/>
import type * as csv from "csv";
import type * as csvSync from "csv/sync";
export type GenerateOptions = csv.generator.Options;
export type ParseOptions = csv.parser.Options;
export type TransformHandler<T, U> = csv.transformer.Handler<T, U>;
export type TransformSyncHandler<T, U> = csvSync.transformer.Handler<T, U>;
export type TransformOptions = csv.transformer.Options;
export type StringifyInput = csv.stringifier.Input;
export type StringifyOptions = csv.stringifier.Options;
export type CSVSetCallback<T> = (csv: Buffer, index: number) => Promise<T> | T;
export type CSVCustomCallback<T> = (csv: Buffer, index: number) => T | Promise<T>;
//# sourceMappingURL=csv.d.ts.map