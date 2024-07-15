/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { Readable } from "node:stream";
import type { CSVCustomCallback, CSVSetCallback, GenerateOptions, ParseOptions, StringifyInput, StringifyOptions, TransformHandler, TransformOptions, TransformSyncHandler } from "../types/index.js";
import * as csv from "csv";
import Core from "./core.js";
export default class CSV extends Core {
    private csvs;
    /**
     * Create unsafe instance
     *
     * to create safe instance:
     * ```js
     *  const csvFile = await CSV.loadFile("csv.csv")
     *
     *  // create safe new instance
     *  const csv = CSV.new(csvFile)
     *  // => CSV
     * ```
     */
    constructor(...csvs: Buffer[]);
    /** get current length of csvs */
    get length(): number;
    /**
     * get csvs of this instance
     *
     * @example
     * ```js
     *  const buffer = await CSV.loadFile("csv.csv")
     *
     *  // not the same reference
     *  const csvs = new CSV(buffer).getCsvs()
     *  // => Buffer[]
     * ```
     */
    getCsvs(): Buffer[];
    /**
     * set csvs
     *
     * @returns - new length
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *
     *  // this method filter invalid csvs before set
     *  const newLength = await csv.setCsvs(\* async *\(csv, index) => {
     *    return index % 2 ? csv : csv.toString()
     *  })
     *  // => 0
     * ```
     */
    setCsvs<T>(callback: CSVSetCallback<T>): Promise<number>;
    /**
     *
     * @param csvs - new csvs (Buffer) to append the exists list
     * @returns - new length
     *
     * @example
     * ```js
     *  const csv = new CSV()
     *  const buffer1 = await CSV.loadFile("csv1.csv")
     *  const buffer2 = await CSV.loadFile("csv2.csv")
     *
     *  // filter invalid csvs
     *  await csv.append(buffer1, Buffer.alloc(0), buffer2)
     *  // => 2
     * ```
     */
    append(...csvs: Buffer[]): Promise<number>;
    /**
     *
     * @param csvs - extend csvs from instance to an another
     * @returns - new length
     *
     * @example
     * ```js
     *  const buffer1 = await CSV.loadFile("csv1.csv")
     *  const buffer2 = await CSV.loadFile("csv2.csv")
     *  const csv1 = new CSV(buffer1, buffer2)
     *
     *  const csv2 = new CSV()
     *
     *  // don't apply any filters
     *  csv2.extend(csv1)
     *  // => 2
     * ```
     */
    extend(...csvs: CSV[]): number;
    /**
     *
     * @returns - clone current instance
     *
     * @example
     * ```js
     *  const csv = new CSV()
     *
     *  // not the same reference
     *  const clone = csv.clone()
     *  // => CSV
     * ```
     */
    clone(): CSV;
    /**
     * Clean csvs array, to free memory
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv1.csv", "csv2.csv")
     *
     *  // Some operations
     *
     *  csv.clean()
     *
     *  // Some operations
     *
     *  csv.append(Buffer.alloc(1))
     * ```
     */
    clean(): void;
    /**
     * filter csvs
     * @returns - new length
     *
     * @example
     * ```js
     *  const csv = new CSV(Buffer.alloc(1))
     *  await csv.filter()
     *  // => 0
     * ```
     */
    filter(): Promise<number>;
    /**
     * @returns - csvs metadata
     *
     * @example
     * ```js
     *  const csv1 = await CSV.loadFile("csv1.csv")
     *  const csv2 = await CSV.loadFile("csv2.csv")
     *
     *  const csv = new CSV(csv1, csv2)
     *  const metadata = await csv.metadata()
     *  // => { size: number; rows: any; columns: any; }[]
     * ```
     */
    metadata(options?: ParseOptions): Promise<{
        size: number;
        rows: any;
        columns: any;
    }[]>;
    /**
     * parse csv
     *
     * @param options - parse options
     * @returns - array contain csv data
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseAsync()
     *  // => any[][]
     * ```
     */
    parseAsync<P = any>(options?: ParseOptions): Promise<Awaited<P>[]>;
    /**
     *
     * @param parsed - parsed csv
     * @param handler - function to handle csv input
     * @param options - transform options
     * @returns - array contain new transformed csv
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseAsync()
     *  const transformed = await csv.transformAsync(parsed, (record) => {
     *    record.push(record.shift());
     *    return record;
     *  })
     *  // => any[][]
     * ```
     */
    transformAsync<T, U, P = any>(parsed: any[], handler: TransformHandler<T, U>, options?: TransformOptions): Promise<Awaited<P>[]>;
    /**
     * Convert array to csv string
     * @param csvs - csv array
     * @param options - stringify options
     * @returns - string in csv format
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseAsync()
     *  const stringified = await CSV.stringifyAsync(parsed)
     *  // => string[]
     * ```
     */
    stringifyAsync(csvs: StringifyInput, options?: StringifyOptions): Promise<string[]>;
    /**
     * parse csv
     *
     * @param options - parse options
     * @returns - array contain csv data
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseStream()
     *  // => Writable[][]
     * ```
     */
    parseStream(options?: ParseOptions): Promise<import("stream").Writable[]>;
    /**
     *
     * @param parsed - parsed csv
     * @param handler - function to handle csv input
     * @param options - transform options
     * @returns - array contain new transformed csv
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseAsync()
     *  const transformed = await csv.transformStream(parsed, (record) => {
     *    record.push(record.shift());
     *    return record;
     *  })
     *  // => Writable[][]
     * ```
     */
    transformStream<T, U>(parsed: any[], handler: TransformHandler<T, U>, options?: TransformOptions): Promise<import("stream").Writable[]>;
    /**
     * Convert array to csv string
     * @param csvs - csv array
     * @param options - stringify options
     * @returns - string in csv format
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseAsync()
     *  const stringified = await CSV.stringifyStream(parsed)
     *  // => Writable[]
     * ```
     */
    stringifyStream(csvs: StringifyInput, options?: StringifyOptions): Promise<import("stream").Writable[]>;
    /**
     * parse csv
     *
     * @param options - parse options
     * @returns - array contain csv data
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = csv.parseSync()
     *  // => any[][]
     * ```
     */
    parseSync(options?: ParseOptions): any[];
    /**
     *
     * @param parsed - parsed csv
     * @param handler - function to handle csv input
     * @param options - transform options
     * @returns - array contain new transformed csv
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseAsync()
     *  const transformed = csv.transformSync(parsed, (record) => {
     *    record.push(record.shift());
     *    return record;
     *  })
     *  // => any[][]
     * ```
     */
    transformSync<T, U>(parsed: any[], handler: TransformSyncHandler<T, U>, options?: TransformOptions): U[][];
    /**
     * Convert array to csv string
     * @param csvs - csv array
     * @param options - stringify options
     * @returns - string in csv format
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  const parsed = await csv.parseAsync()
     *  const stringified = CSV.stringifySync(parsed)
     *  // => string[]
     * ```
     */
    stringifySync(csvs: StringifyInput, options?: StringifyOptions): string[];
    /**
     * @returns - base on the callback return type
     *
     * @example
     * ```js
     *  const csv1 = await CSV.loadFile("csv1.csv")
     *  const csv2 = await CSV.loadFile("csv2.csv")
     *
     *  const csv = new CSV(csv1, csv2)
     *
     *  await csv.custom(\* async *\(csv, _index) => {
     *    return csv.toString();
     *  })
     *  // => string[]
     *
     *  await csv.custom(\* async *\(_csv, index) => {
     *    return index
     *  })
     *  // => number[]
     * ```
     */
    custom<T>(callback: CSVCustomCallback<T>): Promise<Awaited<T>[]>;
    /**
     *
     * @returns - filter non csv
     *
     * @example
     * ```js
     *  const csv1 = await CSV.loadFile("csv1.csv")
     *  const csv2 = await CSV.loadFile("csv2.csv")
     *
     *  const buffer = await CSV.filter(csv1, csv2)
     *  // => Buffer[]
     * ```
     */
    static filter(...csvs: Buffer[]): Promise<Buffer[]>;
    /**
     * @throws
     *
     * load csvs from files
     * @returns - loaded files
     *
     * @example
     * ```js
     *  const csv = await CSV.fromFile("csv.csv")
     *  // => CSV
     *
     *  const csv = await CSV.fromFile("csv1.csv", "csv2.csv")
     *  // => CSV
     *  const length = csv.length
     *  // => 2
     *
     *  const csv = await CSV.fromFile("")
     *  // => Error (throw)
     * ```
     */
    static fromFile(...path: string[]): Promise<CSV>;
    /**
     * @throws
     *
     * load csvs from urls
     * @returns - loaded urls
     *
     * @example
     * ```js
     *  const csv = await CSV.fromUrl("http://example.com/csv.csv")
     *  // => CSV
     *
     *  const csv = await CSV.fromUrl("http://example.com/csv.csv", "http://example.com/csv.csv")
     *  // => CSV
     *  const length = csv.length
     *  // => 2
     *
     *  const csv = await CSV.fromUrl("csv.csv")
     *  // => Error (throw)
     * ```
     */
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<CSV>;
    /**
     * @throws
     *
     * @param csvs - csvs buffer
     * @returns - create new safe instance
     *
     * @example
     * ```js
     *  const csv = await CSV.new(Buffer.alloc(0))
     *  // => Error (throw)
     *
     *  const csvFile = await CSV.loadFile("csv.csv")
     *
     *  // filter non csv
     *  const csv = await CSV.new(csvFile, Buffer.alloc(0))
     *  // => CSV
     *  const length = csv.length
     *  // => 1
     * ```
     */
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