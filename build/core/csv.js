var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generate, parse, transform, stringify } from "csv";
import { FilterFile } from "../helper/index.js";
import Core from "./core.js";
export default class CSV extends Core {
    constructor(...csvs) {
        super();
        this.csvs = csvs;
    }
    getCsvs() {
        return [...this.csvs];
    }
    setCsvs(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvs = yield Promise.all(this.csvs.map((csv, index) => callback(csv, index)));
            const filteredCsvs = csvs.filter((csv) => Buffer.isBuffer(csv));
            this.csvs = filteredCsvs;
        });
    }
    append(...csvs) {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredCsvs = yield CSV.filter(...csvs);
            this.csvs.push(...filteredCsvs);
        });
    }
    extend(...csvs) {
        csvs.forEach((csv) => {
            this.csvs.push(...csv.getCsvs());
        });
    }
    clone() {
        return new CSV(...this.csvs);
    }
    filter() {
        return __awaiter(this, void 0, void 0, function* () {
            this.csvs = yield CSV.filter(...this.csvs);
            return this.csvs.length;
        });
    }
    metadata() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.csvs.map((csv) => __awaiter(this, void 0, void 0, function* () {
                const rows = csv.toString().split(/\r?\n/);
                const columns = rows.reduce((prev, row) => prev + row.split(",").length, 0);
                return {
                    size: csv.length,
                    rows: rows.length,
                    columns: Math.round(columns / rows.length),
                };
            })));
        });
    }
    parse(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.csvs.map((csv) => CSV.parse(csv, options)));
        });
    }
    transform(handler, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const parses = yield this.parse();
            return Promise.all(parses.map((parse) => CSV.transform(parse, handler, options)));
        });
    }
    custom(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(this.csvs.map((csv, index) => callback(csv, index)));
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
    static generate() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return new Promise((resolve, reject) => {
                generate(options, (err, records) => {
                    if (err)
                        return reject(err);
                    resolve(records);
                });
            });
        });
    }
    static parse(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, options = {}) {
            return new Promise((resolve, reject) => {
                parse(input, options, (err, records) => {
                    if (err)
                        return reject(err);
                    resolve(records);
                });
            });
        });
    }
    static transform(records_1, handler_1) {
        return __awaiter(this, arguments, void 0, function* (records, handler, options = {}) {
            return new Promise((resolve, reject) => {
                transform(records, options, handler, (err, records) => {
                    if (err)
                        return reject(err);
                    resolve(records);
                });
            });
        });
    }
    static stringify(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, options = {}) {
            return new Promise((resolve, reject) => {
                stringify(input, options, (err, str) => {
                    if (err)
                        return reject(err);
                    resolve(str);
                });
            });
        });
    }
}
//# sourceMappingURL=csv.js.map