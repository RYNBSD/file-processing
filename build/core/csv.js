var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as csv from "csv";
import * as csvSync from "csv/sync";
import { FilterFile, loader, parser } from "../helper/index.js";
import Core from "./core.js";
import { ProcessorError } from "../error/index.js";
export default class CSV extends Core {
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
    constructor(...csvs) {
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
    setCsvs(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvs = yield Promise.all(this.csvs.map((csv, index) => __awaiter(this, void 0, void 0, function* () { return callback(csv, index); })));
            const filteredCsvs = csvs.filter((csv) => Buffer.isBuffer(csv) && csv.length > 0);
            this.csvs = filteredCsvs;
            return this.length;
        });
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
    append(...csvs) {
        return __awaiter(this, void 0, void 0, function* () {
            // const filteredCsvs = await CSV.filter(...csvs);
            const filteredCsvs = csvs.filter((csv) => Buffer.isBuffer(csv) && csv.length > 0);
            this.csvs.push(...filteredCsvs);
            return this.length;
        });
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
    extend(...csvs) {
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
    clone() {
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
    clean() {
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
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.csvs = yield CSV.filter(...this.csvs);
            return this.length;
        });
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
    metadata(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((csv) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const parse = yield CSV.parseAsync(csv, options);
                return {
                    size: csv.length,
                    rows: parse.length,
                    columns: (_b = (_a = parse === null || parse === void 0 ? void 0 : parse[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
                };
            }));
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
    parseAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.custom((c) => CSV.parseAsync(c, options));
        });
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
    transformAsync(parsed, handler, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(parsed.map((p) => CSV.transformAsync(p, handler, options)));
        });
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
    stringifyAsync(csvs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(csvs.map((c) => CSV.stringifyAsync(c, options)));
        });
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
    parseStream(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield parser.toReadable(this.csvs);
            return reads.map((csv) => CSV.parseStream(csv, options));
        });
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
    transformStream(parsed, handler, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield parser.toReadable(parsed);
            return reads.map((csv) => CSV.transformStream(csv, handler, options));
        });
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
    stringifyStream(csvs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield parser.toReadable(csvs);
            return reads.map((csv) => CSV.stringifyStream(csv, options));
        });
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
    parseSync(options) {
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
    transformSync(parsed, handler, options) {
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
    stringifySync(csvs, options) {
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
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.csvs.map((csv, index) => __awaiter(this, void 0, void 0, function* () { return callback(csv, index); })));
        });
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
    static filter(...csvs) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...csvs).custom("csv");
        });
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
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield loader.loadFile(path);
            return CSV.new(buffer);
        });
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
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield loader.loadUrl(url);
            return CSV.new(buffer);
        });
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
    static new(csvs) {
        const filtered = csvs.filter((csv) => csv.length > 0);
        if (filtered.length === 0)
            throw ProcessorError.csv("Non valid csv");
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
    static isCSV(obj) {
        return obj instanceof CSV;
    }
    // Async //
    static generateAsync() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return new Promise((resolve, reject) => {
                csv.generate(options, (err, records) => {
                    if (err)
                        return reject(err);
                    resolve(records);
                });
            });
        });
    }
    static parseAsync(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, options = {}) {
            return new Promise((resolve, reject) => {
                csv.parse(input, options, (err, records) => {
                    if (err)
                        return reject(err);
                    resolve(records);
                });
            });
        });
    }
    static transformAsync(records_1, handler_1) {
        return __awaiter(this, arguments, void 0, function* (records, handler, options = {}) {
            return new Promise((resolve, reject) => {
                csv.transform(records, options, handler, (err, records) => {
                    if (err)
                        return reject(err);
                    resolve(records);
                });
            });
        });
    }
    static stringifyAsync(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, options = {}) {
            return new Promise((resolve, reject) => {
                csv.stringify(input, options, (err, str) => {
                    if (err)
                        return reject(err);
                    resolve(str);
                });
            });
        });
    }
    // Stream //
    static generateStream(options = {}) {
        return csv.generate(options);
    }
    static parseStream(readable, options = {}) {
        return Core.stream(readable, csv.parse(options));
    }
    static transformStream(readable, handler, options = {}) {
        return Core.stream(readable, csv.transform(options, handler));
    }
    static stringifyStream(readable, options = {}) {
        return Core.stream(readable, csv.stringify(options));
    }
    // Sync //
    static generateSync(options = {}) {
        return csvSync.generate(options);
    }
    static parseSync(input, options = {}) {
        return csvSync.parse(input, options);
    }
    static transformSync(records, handler, options = {}) {
        return csvSync.transform(records, options, handler);
    }
    static stringifySync(input, options = {}) {
        return csvSync.stringify(input, options);
    }
}
//# sourceMappingURL=csv.js.map