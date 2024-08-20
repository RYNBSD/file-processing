import { BaseError } from "./base.js";

export const PROCESSORS = ["Image", "Text", "Video", "Audio", "AV", "PDF", "CSV"] as const;

export class ProcessorError extends BaseError {
  constructor(processor: Processors, message: string) {
    super(`${processor} Processor: ${message}`);
  }

  static image(message: string) {
    return new ProcessorError("Image", message);
  }

  static video(message: string) {
    return new ProcessorError("Video", message);
  }

  static audio(message: string) {
    return new ProcessorError("Audio", message);
  }

  static av(message: string) {
    return new ProcessorError("AV", message);
  }

  static text(message: string) {
    return new ProcessorError("Text", message);
  }

  static pdf(message: string) {
    return new ProcessorError("PDF", message);
  }
  static csv(message: string) {
    return new ProcessorError("CSV", message);
  }

  static isProcessorError(error: unknown): error is ProcessorError {
    return (
      error instanceof ProcessorError ||
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
        PROCESSORS.includes(error.processor as Processors))
    );
  }
}

type Processors = (typeof PROCESSORS)[number];
