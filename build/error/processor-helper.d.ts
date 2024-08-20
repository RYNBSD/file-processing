import { BaseError } from "./base.js";
declare const HELPERS: readonly ["Filter", "Tmp", "Loader", "Parser"];
export declare class ProcessorHelperError extends BaseError {
    constructor(helper: Helpers, message: string);
    static filter(message: string): ProcessorHelperError;
    static tmp(message: string): ProcessorHelperError;
    static loader(message: string): ProcessorHelperError;
    static parser(message: string): ProcessorHelperError;
    static isProcessorHelperError(error: unknown): error is ProcessorHelperError;
}
type Helpers = (typeof HELPERS)[number];
export {};
//# sourceMappingURL=processor-helper.d.ts.map