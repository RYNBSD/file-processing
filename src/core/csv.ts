import type { generator, parser, transformer, stringifier } from "csv/sync";
import type { CSVCustomCallback, CSVSetCallback } from "../types/index.js";
import { generate, parse, transform, stringify } from "csv";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";

export default class CSV extends Core {
  private csvs: Buffer[];
  constructor(...csvs: Buffer[]) {
    super();
    this.csvs = csvs;
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
    const filteredCsvs = await CSV.filter(...csvs);
    this.csvs.push(...filteredCsvs);
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
    return this.csvs.length;
  }

  override async metadata() {
    return Promise.all(
      this.csvs.map(async (csv) => {
        const rows = csv.toString().split(/\r?\n/);
        const columns = rows.reduce((prev, row) => prev + row.split(",").length, 0);

        return {
          size: csv.length,
          rows: rows.length,
          columns: Math.round(columns / rows.length),
        };
      })
    );
  }

  async parse(options?: parser.Options) {
    return Promise.all(this.csvs.map((csv) => CSV.parse(csv, options)));
  }

  async transform<T, U>(
    handler: transformer.Handler<T, U>,
    options?: transformer.Options
  ) {
    const parses = await this.parse();
    return Promise.all(
      parses.map((parse) => CSV.transform(parse, handler, options))
    );
  }

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

  static async generate<P = any>(options: generator.Options = {}) {
    return new Promise<P>((resolve, reject) => {
      generate(options, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
    });
  }

  static async parse<T extends Buffer | string, P = any>(
    input: T,
    options: parser.Options = {}
  ) {
    return new Promise<P>((resolve, reject) => {
      parse(input, options, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
    });
  }

  static async transform<T, U, P = any>(
    records: T[],
    handler: transformer.Handler<T, U>,
    options: transformer.Options = {}
  ) {
    return new Promise<P>((resolve, reject) => {
      transform(records, options, handler, (err, records) => {
        if (err) return reject(err);
        resolve(records as P);
      });
    });
  }

  static async stringify(
    input: stringifier.Input,
    options: stringifier.Options = {}
  ) {
    return new Promise<string>((resolve, reject) => {
      stringify(input, options, (err, str) => {
        if (err) return reject(err);
        resolve(str);
      });
    });
  }
}
