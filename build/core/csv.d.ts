/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Readable } from "node:stream";
import type { CSVCustomCallback, CSVSetCallback, GenerateOptions, ParseOptions, StringifyInput, StringifyOptions, TransformHandler, TransformOptions, TransformSyncHandler } from "../types/index.js";
import * as csv from "csv";
import Core from "./core.js";
export default class CSV extends Core {
    private csvs;
    constructor(...csvs: Buffer[]);
    get length(): number;
    getCsvs(): Buffer[];
    setCsvs<T>(callback: CSVSetCallback<T>): Promise<number>;
    append(...csvs: Buffer[]): Promise<number>;
    extend(...csvs: CSV[]): number;
    clone(): CSV;
    filter(): Promise<number>;
    metadata(): Promise<{
        size: number;
        rows: any;
        columns: any;
    }[]>;
    parseAsync<P = any>(options?: ParseOptions): Promise<Awaited<P>[]>;
    transformAsync<T, U, P = any>(parsed: any[], handler: TransformHandler<T, U>, options?: TransformOptions): Promise<Awaited<P>[]>;
    stringifyAsync(csvs: StringifyInput, options?: StringifyOptions): Promise<string[]>;
    parseStream(options?: ParseOptions): Promise<import("stream").Writable[]>;
    transformStream<T, U>(parsed: any[], handler: TransformHandler<T, U>, options?: TransformOptions): Promise<import("stream").Writable[]>;
    stringifyStream(csvs: StringifyInput, options?: StringifyOptions): Promise<import("stream").Writable[]>;
    parseSync(options?: ParseOptions): any[];
    transformSync<T, U>(parsed: any[], handler: TransformSyncHandler<T, U>, options?: TransformOptions): U[][];
    stringifySync(csvs: StringifyInput, options?: StringifyOptions): string[];
    custom<T>(callback: CSVCustomCallback<T>): Promise<Awaited<T>[]>;
    static filter(...csvs: Buffer[]): Promise<Buffer[]>;
    static fromFile(...path: string[]): Promise<CSV>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<CSV>;
    static new(csvs: Buffer[]): CSV;
    /**
     * check if an object is instance of CSV or not
     * @returns - boolean
     *
     * @example
     * ```js
     *  const csv = new CSV()
     *  const isCSV = CSV.isCSV(csv)
     *  // => true
     *
     *  const object = new Object()
     *  const isNotCSV = CSV.isCSV(object)
     *  // => false
     * ```
     */
    static isCSV(obj: unknown): obj is CSV;
    static generateAsync<P = any>(options?: GenerateOptions): Promise<P>;
    static parseAsync<T extends Buffer | string, P = any>(input: T, options?: ParseOptions): Promise<P>;
    static transformAsync<T, U, P = any>(records: T[], handler: TransformHandler<T, U>, options?: TransformOptions): Promise<P>;
    static stringifyAsync(input: StringifyInput, options?: StringifyOptions): Promise<string>;
    static generateStream(options?: GenerateOptions): csv.generator.Generator;
    static parseStream(readable: Readable, options?: ParseOptions): import("stream").Writable;
    static transformStream<T, U>(readable: Readable, handler: TransformHandler<T, U>, options?: TransformOptions): import("stream").Writable;
    static stringifyStream(readable: Readable, options?: StringifyOptions): import("stream").Writable;
    static generateSync(options?: GenerateOptions): string & any[];
    static parseSync<T extends Buffer | string>(input: T, options?: ParseOptions): any;
    static transformSync<T, U>(records: T[], handler: TransformSyncHandler<T, U>, options?: TransformOptions): U[];
    static stringifySync(input: StringifyInput, options?: StringifyOptions): string;
}
//# sourceMappingURL=csv.d.ts.map