import { BaseError } from "./base.js";
const HELPERS = ["Filter", "Tmp", "Loader", "Parser"];
export class ProcessorHelperError extends BaseError {
    constructor(helper, message) {
        super(`${helper} Processor Helper: ${message}`);
    }
    static filter(message) {
        return new ProcessorHelperError("Filter", message);
    }
    static tmp(message) {
        return new ProcessorHelperError("Tmp", message);
    }
    static loader(message) {
        return new ProcessorHelperError("Loader", message);
    }
    static parser(message) {
        return new ProcessorHelperError("Parser", message);
    }
    static isProcessorHelperError(error) {
        return (error instanceof ProcessorHelperError ||
            (typeof error !== "undefined" &&
                typeof error === "object" &&
                error !== null &&
                "name" in error &&
                typeof error.name === "string" &&
                error.name === ProcessorHelperError.name &&
                "message" in error &&
                typeof error.message === "string" &&
                "helper" in error &&
                typeof error.helper === "string" &&
                HELPERS.includes(error.helper)));
    }
}
//# sourceMappingURL=processor-helper.js.map