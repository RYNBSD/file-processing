import type { Readable } from "node:stream";
import type {
  CSVCustomCallback,
  CSVSetCallback,
  GenerateOptions,
  ParseOptions,
  StringifyInput,
  StringifyOptions,
  TransformHandler,
  TransformOptions,
  TransformSyncHandler,
} from "../types/index.js";
import * as csv from "csv";
import * as csvSync from "csv/sync";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";

export default class CSV extends Core {
  private csvs: Buffer[];

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
  constructor(...csvs: Buffer[]) {
    super();
    this.csvs = csvs;
  }

  /** get current length of csvs */
  get length() {
    return this.csvs.length;
  }

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
  getCsvs() {
    return [...this.csvs];
  }

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
  async setCsvs<T>(callback: CSVSetCallback<T>) {
    const csvs = await Promise.all(this.csvs.map(async (csv, index) => callback(csv, index)));
    const filteredCsvs = csvs.filter((csv) => Buffer.isBuffer(csv) && csv.length > 0) as Buffer[];
    this.csvs = filteredCsvs;
    return this.length;
  }

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
  override async append(...csvs: Buffer[]) {
    // const filteredCsvs = await CSV.filter(...csvs);
    const filteredCsvs = csvs.filter((csv) => Buffer.isBuffer(csv) && csv.length > 0) as Buffer[];
    this.csvs.push(...filteredCsvs);
    return this.length;
  }

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
  override extend(...csvs: CSV[]) {
    csvs.forEach((csv) => {
      this.csvs.push(...csv.getCsvs());
    });
    return this.length;
  }

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
  override clone() {
    return new CSV(...this.csvs);
  }

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
  override clean() {
    this.csvs = [];
  }

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
  override async filter() {
    this.csvs = await CSV.filter(...this.csvs);
    return this.length;
  }

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
  override async metadata(options?: ParseOptions) {
    return this.custom(async (csv) => {
      const parse = await CSV.parseAsync(csv, options);
      return {
        size: csv.length,
        rows: parse.length,
        columns: parse?.[0]?.length ?? 0,
      };
    });
  }

  // Async //

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
  async parseAsync<P = any>(options?: ParseOptions) {
    return this.custom((c) => CSV.parseAsync<Buffer, P>(c, options));
  }

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
  async transformAsync<T, U, P = any>(parsed: any[], handler: TransformHandler<T, U>, options?: TransformOptions) {
    return Promise.all(parsed.map((p) => CSV.transformAsync<T, U, P>(p, handler, options)));
  }

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
  async stringifyAsync(csvs: StringifyInput, options?: StringifyOptions) {
    return Promise.all(csvs.map((c) => CSV.stringifyAsync(c, options)));
  }

  // Stream //

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
  async parseStream(options?: ParseOptions) {
    const reads = await Core.toReadable(this.csvs);
    return reads.map((csv) => CSV.parseStream(csv, options));
  }

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
  async transformStream<T, U>(parsed: any[], handler: TransformHandler<T, U>, options?: TransformOptions) {
    const reads = await Core.toReadable(parsed);
    return reads.map((csv) => CSV.transformStream(csv, handler, options));
  }

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
  async stringifyStream(csvs: StringifyInput, options?: StringifyOptions) {
    const reads = await Core.toReadable(csvs);
    return reads.map((csv) => CSV.stringifyStream(csv, options));
  }

  // Sync //

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
  parseSync(options?: ParseOptions) {
    return this.csvs.map((c) => CSV.parseSync(c, options));
  }

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
  transformSync<T, U>(parsed: any[], handler: TransformSyncHandler<T, U>, options?: TransformOptions) {
    return parsed.map((p) => CSV.transformSync(p, handler, options));
  }

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
  stringifySync(csvs: StringifyInput, options?: StringifyOptions) {
    return csvs.map((c) => CSV.stringifySync(c, options));
  }

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
  async custom<T>(callback: CSVCustomCallback<T>): Promise<Awaited<T>[]> {
    return Promise.all(this.csvs.map(async (csv, index) => callback(csv, index)));
  }

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
  static async filter(...csvs: Buffer[]) {
    return new FilterFile(...csvs).custom("csv");
  }

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
  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    return CSV.new(buffer);
  }

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
  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    return CSV.new(buffer);
  }

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
  static new(csvs: Buffer[]) {
    const filtered = csvs.filter((csv) => csv.length > 0);
    if (filtered.length === 0) throw new Error(`${CSV.name}: Non valid csv`);
    return new CSV(...filtered);
  }

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
  static isCSV(obj: unknown): obj is CSV {
    return obj instanceof CSV;
  }

  // Async //

  static async generateAsync<P = any>(options: GenerateOptions = {}) {
    return new Promise<P>((resolve, reject) => {
      csv.generate(options, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
    });
  }

  static async parseAsync<T extends Buffer | string, P = any>(input: T, options: ParseOptions = {}) {
    return new Promise<P>((resolve, reject) => {
      csv.parse(input, options, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
    });
  }

  static async transformAsync<T, U, P = any>(
    records: T[],
    handler: TransformHandler<T, U>,
    options: TransformOptions = {},
  ) {
    return new Promise<P>((resolve, reject) => {
      csv.transform(records, options, handler, (err, records) => {
        if (err) return reject(err);
        resolve(records as P);
      });
    });
  }

  static async stringifyAsync(input: StringifyInput, options: StringifyOptions = {}) {
    return new Promise<string>((resolve, reject) => {
      csv.stringify(input, options, (err, str) => {
        if (err) return reject(err);
        resolve(str);
      });
    });
  }

  // Stream //

  static generateStream(options: GenerateOptions = {}) {
    return csv.generate(options);
  }

  static parseStream(readable: Readable, options: ParseOptions = {}) {
    return Core.stream(readable, csv.parse(options));
  }

  static transformStream<T, U>(readable: Readable, handler: TransformHandler<T, U>, options: TransformOptions = {}) {
    return Core.stream(readable, csv.transform(options, handler));
  }

  static stringifyStream(readable: Readable, options: StringifyOptions = {}) {
    return Core.stream(readable, csv.stringify(options));
  }

  // Sync //

  static generateSync(options: GenerateOptions = {}) {
    return csvSync.generate(options);
  }

  static parseSync<T extends Buffer | string>(input: T, options: ParseOptions = {}) {
    return csvSync.parse(input, options);
  }

  static transformSync<T, U>(records: T[], handler: TransformSyncHandler<T, U>, options: TransformOptions = {}) {
    return csvSync.transform(records, options, handler);
  }

  static stringifySync(input: StringifyInput, options: StringifyOptions = {}) {
    return csvSync.stringify(input, options);
  }
}
