/// <reference types="node" resolution-mode="require"/>
import type { generator, parser, transformer, stringifier } from "csv/sync";
import type { CSVCustomCallback, CSVSetCallback } from "../types/index.js";
import Core from "./core.js";
export default class CSV extends Core {
    private csvs;
    constructor(...csvs: Buffer[]);
    getCsvs(): Buffer[];
    setCsvs<T>(callback: CSVSetCallback<T>): Promise<void>;
    append(...csvs: Buffer[]): Promise<void>;
    extend(...csvs: CSV[]): void;
    clone(): CSV;
    filter(): Promise<number>;
    metadata(): Promise<{
        size: number;
        rows: number;
        columns: number;
    }[]>;
    parse(options?: parser.Options): Promise<any[]>;
    transform<T, U>(handler: transformer.Handler<T, U>, options?: transformer.Options): Promise<any[]>;
    custom<T>(callback: CSVCustomCallback<T>): Promise<Awaited<T>[]>;
    static filter(...csvs: Buffer[]): Promise<Buffer[]>;
    static fromFile(...path: string[]): Promise<CSV>;
    static fromUrl<T extends string[] | URL[]>(...url: T): Promise<CSV>;
    static generate<P = any>(options?: generator.Options): Promise<P>;
    static parse<T extends Buffer | string, P = any>(input: T, options?: parser.Options): Promise<P>;
    static transform<T, U, P = any>(records: T[], handler: transformer.Handler<T, U>, options?: transformer.Options): Promise<P>;
    static stringify(input: stringifier.Input, options?: stringifier.Options): Promise<string>;
}
//# sourceMappingURL=csv.d.ts.map