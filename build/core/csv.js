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
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";
export default class CSV extends Core {
    constructor(...csvs) {
        super();
        this.csvs = csvs;
    }
    get length() {
        return this.csvs.length;
    }
    getCsvs() {
        return [...this.csvs];
    }
    setCsvs(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvs = yield Promise.all(this.csvs.map((csv, index) => __awaiter(this, void 0, void 0, function* () { return callback(csv, index); })));
            const filteredCsvs = csvs.filter((csv) => Buffer.isBuffer(csv) && csv.length > 0);
            this.csvs = filteredCsvs;
            return this.length;
        });
    }
    append(...csvs) {
        return __awaiter(this, void 0, void 0, function* () {
            // const filteredCsvs = await CSV.filter(...csvs);
            this.csvs.push(...csvs);
            return this.length;
        });
    }
    extend(...csvs) {
        csvs.forEach((csv) => {
            this.csvs.push(...csv.getCsvs());
        });
        return this.length;
    }
    clone() {
        return new CSV(...this.csvs);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.csvs = yield CSV.filter(...this.csvs);
            return this.length;
        });
    }
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.csvs.map((csv) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const parse = yield CSV.parseAsync(csv);
                return {
                    size: csv.length,
                    rows: parse.length,
                    columns: (_b = (_a = parse === null || parse === void 0 ? void 0 : parse[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
                };
            })));
        });
    }
    // Async //
    parseAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.csvs.map((c) => __awaiter(this, void 0, void 0, function* () { return CSV.parseAsync(c, options); })));
        });
    }
    transformAsync(parsed, handler, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(parsed.map((p) => __awaiter(this, void 0, void 0, function* () { return CSV.transformAsync(p, handler, options); })));
        });
    }
    stringifyAsync(csvs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(csvs.map((c) => __awaiter(this, void 0, void 0, function* () { return CSV.stringifyAsync(c, options); })));
        });
    }
    // Stream //
    parseStream(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield Core.toReadable(this.csvs);
            return reads.map((csv) => CSV.parseStream(csv, options));
        });
    }
    transformStream(parsed, handler, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield Core.toReadable(parsed);
            return reads.map((csv) => CSV.transformStream(csv, handler, options));
        });
    }
    stringifyStream(csvs, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const reads = yield Core.toReadable(csvs);
            return reads.map((csv) => CSV.stringifyStream(csv, options));
        });
    }
    // Sync //
    parseSync(options) {
        return this.csvs.map((c) => CSV.parseSync(c, options));
    }
    transformSync(parsed, handler, options) {
        return parsed.map((p) => CSV.transformSync(p, handler, options));
    }
    stringifySync(csvs, options) {
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
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.csvs.map((csv, index) => __awaiter(this, void 0, void 0, function* () { return callback(csv, index); })));
        });
    }
    static filter(...csvs) {
        return __awaiter(this, void 0, void 0, function* () {
            return new FilterFile(...csvs).custom("csv");
        });
    }
    static fromFile(...path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadFile(path);
            return new CSV(...buffer);
        });
    }
    static fromUrl(...url) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Core.loadUrl(url);
            return new CSV(...buffer);
        });
    }
    static new(csvs) {
        const filtered = csvs.filter((csv) => csv.length > 0);
        if (filtered.length === 0)
            throw new Error(`${CSV.name}: Non valid csv`);
        return new CSV(...filtered);
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