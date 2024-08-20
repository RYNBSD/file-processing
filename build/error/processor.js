import { BaseError } from "./base.js";
export const PROCESSORS = ["Image", "Text", "Video", "Audio", "AV", "PDF", "CSV"];
export class ProcessorError extends BaseError {
    constructor(processor, message) {
        super(`${processor} Processor: ${message}`);
    }
    static image(message) {
        return new ProcessorError("Image", message);
    }
    static video(message) {
        return new ProcessorError("Video", message);
    }
    static audio(message) {
        return new ProcessorError("Audio", message);
    }
    static av(message) {
        return new ProcessorError("AV", message);
    }
    static text(message) {
        return new ProcessorError("Text", message);
    }
    static pdf(message) {
        return new ProcessorError("PDF", message);
    }
    static csv(message) {
        return new ProcessorError("CSV", message);
    }
    static isProcessorError(error) {
        return (error instanceof ProcessorError ||
            (typeof error !== "undefined" &&
                typeof error === "object" &&
                error !== null &&
                "name" in error &&
                typeof error.name === "string" &&
                error.name === ProcessorError.name &&
                "message" in error &&
                typeof error.message === "string" &&
                "processor" in error &&
                typeof error.processor === "string" &&
                PROCESSORS.includes(error.processor)));
    }
}
//# sourceMappingURL=processor.js.map