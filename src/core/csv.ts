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
  constructor(...csvs: Buffer[]) {
    super();
    this.csvs = csvs;
  }

  get length() {
    return this.csvs.length;
  }

  getCsvs() {
    return [...this.csvs];
  }

  async setCsvs<T>(callback: CSVSetCallback<T>) {
    const csvs = await Promise.all(
      this.csvs.map((csv, index) => callback(csv, index))
    );
    const filteredCsvs = csvs.filter((csv) => Buffer.isBuffer(csv)) as Buffer[];
    this.csvs = filteredCsvs;
  }

  override async append(...csvs: Buffer[]) {
    // const filteredCsvs = await CSV.filter(...csvs);
    this.csvs.push(...csvs);
  }

  override extend(...csvs: CSV[]) {
    csvs.forEach((csv) => {
      this.csvs.push(...csv.getCsvs());
    });
  }

  override clone() {
    return new CSV(...this.csvs);
  }

  override async filter() {
    this.csvs = await CSV.filter(...this.csvs);
    return this.length;
  }

  override async metadata() {
    return Promise.all(
      this.csvs.map(async (csv) => {
        const parse = await CSV.parseAsync(csv);
        return {
          size: csv.length,
          rows: parse.length,
          columns: parse?.[0]?.length ?? 0,
        };
      })
    );
  }

  // Async //

  async parseAsync(options?: ParseOptions) {
    return Promise.all(this.csvs.map((c) => CSV.parseAsync(c, options)));
  }

  async transformAsync<T, U>(
    parsed: any[],
    handler: TransformHandler<T, U>,
    options?: TransformOptions
  ) {
    return Promise.all(
      parsed.map((p) => CSV.transformAsync(p, handler, options))
    );
  }

  async stringifyAsync(csvs: StringifyInput, options?: StringifyOptions) {
    return Promise.all(csvs.map((c) => CSV.stringifyAsync(c, options)));
  }

  // Stream //

  async parseStream(options?: ParseOptions) {
    const reads = await Core.toReadable(this.csvs);
    return reads.map((csv) => Core.stream(csv, CSV.parseStream(options)));
  }

  async transformStream<T, U>(
    parsed: any[],
    handler: TransformHandler<T, U>,
    options?: TransformOptions
  ) {
    const reads = await Core.toReadable(parsed);
    return reads.map((csv) =>
      Core.stream(csv, CSV.transformStream(handler, options))
    );
  }

  async stringifyStream(csvs: StringifyInput, options?: StringifyOptions) {
    const reads = await Core.toReadable(csvs);
    return reads.map((csv) => Core.stream(csv, CSV.stringifyStream(options)));
  }

  // Sync //

  parseSync(options?: ParseOptions) {
    return this.csvs.map((c) => CSV.parseSync(c, options));
  }

  transformSync<T, U>(
    parsed: any[],
    handler: TransformSyncHandler<T, U>,
    options?: TransformOptions
  ) {
    return parsed.map((p) => CSV.transformSync(p, handler, options));
  }

  stringifySync(csvs: StringifyInput, options?: StringifyOptions) {
    return csvs.map((c) => CSV.stringifySync(c, options));
  }

  // parseStream(options?: ParseOptions): Stream[] {
  //   return this.csvs.map((csv) => CSV.parseStream(csv, options));
  // }

  // transformStream<T, U>(
  //   handler: TransformHandler<T, U>,
  //   options?: TransformOptions
  // ): Stream[] {
  //   return this.csvs.map((c) => {
  //     return csv.parse(c).pipe(csv.transform(options, handler));
  //   });
  // }

  async custom<T>(callback: CSVCustomCallback<T>): Promise<Awaited<T>[]> {
    return Promise.all(this.csvs.map((csv, index) => callback(csv, index)));
  }

  static async filter(...csvs: Buffer[]) {
    return new FilterFile(...csvs).custom("csv");
  }

  static async fromFile(...path: string[]) {
    const buffer = await Core.loadFile(path);
    return new CSV(...buffer);
  }

  static async fromUrl<T extends string[] | URL[]>(...url: T) {
    const buffer = await Core.loadUrl(url);
    return new CSV(...buffer);
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

  static async parseAsync<T extends Buffer | string, P = any>(
    input: T,
    options: ParseOptions = {}
  ) {
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
    options: TransformOptions = {}
  ) {
    return new Promise<P>((resolve, reject) => {
      csv.transform(records, options, handler, (err, records) => {
        if (err) return reject(err);
        resolve(records as P);
      });
    });
  }

  static async stringifyAsync(
    input: StringifyInput,
    options: StringifyOptions = {}
  ) {
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

  static parseStream(options: ParseOptions = {}) {
    return csv.parse(options);
  }

  static transformStream<T, U>(
    handler: TransformHandler<T, U>,
    options: TransformOptions = {}
  ) {
    return csv.transform(options, handler);
  }

  static stringifyStream(options: StringifyOptions = {}) {
    return csv.stringify(options);
  }

  // Sync //

  static generateSync(options: GenerateOptions = {}) {
    return csvSync.generate(options);
  }

  static parseSync<T extends Buffer | string>(
    input: T,
    options: ParseOptions = {}
  ) {
    return csvSync.parse(input, options);
  }

  static transformSync<T, U>(
    records: T[],
    handler: TransformSyncHandler<T, U>,
    options: TransformOptions = {}
  ) {
    return csvSync.transform(records, options, handler);
  }

  static stringifySync(input: StringifyInput, options: StringifyOptions = {}) {
    return csvSync.stringify(input, options);
  }
}
