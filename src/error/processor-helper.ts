import { BaseError } from "./base.js";

const HELPERS = ["Filter", "Tmp", "Loader", "Parser"] as const;

export class ProcessorHelperError extends BaseError {
  constructor(helper: Helpers, message: string) {
    super(`${helper} Processor Helper: ${message}`);
  }

  static filter(message: string) {
    return new ProcessorHelperError("Filter", message);
  }

  static tmp(message: string) {
    return new ProcessorHelperError("Tmp", message);
  }

  static loader(message: string) {
    return new ProcessorHelperError("Loader", message);
  }

  static parser(message: string) {
    return new ProcessorHelperError("Parser", message);
  }

  static isProcessorHelperError(error: unknown): error is ProcessorHelperError {
    return (
      error instanceof ProcessorHelperError ||
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
        HELPERS.includes(error.helper as Helpers))
    );
  }
}

type Helpers = (typeof HELPERS)[number];
