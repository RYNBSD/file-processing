import { BaseError } from "./base.js";
export declare const PROCESSORS: readonly ["Image", "Text", "Video", "Audio", "AV", "PDF", "CSV"];
export declare class ProcessorError extends BaseError {
    constructor(processor: Processors, message: string);
    static image(message: string): ProcessorError;
    static video(message: string): ProcessorError;
    static audio(message: string): ProcessorError;
    static av(message: string): ProcessorError;
    static text(message: string): ProcessorError;
    static pdf(message: string): ProcessorError;
    static csv(message: string): ProcessorError;
    static isProcessorError(error: unknown): error is ProcessorError;
}
type Processors = (typeof PROCESSORS)[number];
export {};
//# sourceMappingURL=processor.d.ts.map