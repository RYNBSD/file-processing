import type { InputFiles } from "../types/index.js";
import { readFile } from "node:fs/promises";
import { isReadable, isStream, stream2buffer } from "@ryn-bsd/from-buffer-to";
import {
  isArrayBuffer,
  isSharedArrayBuffer,
  isUint8Array,
} from "node:util/types";

export async function input2buffer(input: InputFiles) {
  if (Buffer.isBuffer(input)) return input;
  else if (typeof input === "string") return readFile(input);
  else if (isReadable(input) || isStream(input)) return stream2buffer(input);
  else if (
    isUint8Array(input) ||
    isArrayBuffer(input) ||
    isSharedArrayBuffer(input)
  )
    return Buffer.from(input);

  return null;
}

export function isArrayOfBuffer(array: unknown[]): array is Buffer[] {
  if (!Array.isArray(array)) return false;
  for (const arr of array) if (!Buffer.isBuffer(arr)) return false;
  return true;
}

export function isArrayOfString(array: unknown[]): array is string[] {
  if (!Array.isArray(array)) return false;
  for (const arr of array) if (typeof arr !== "string") return false;
  return true;
}

export function isUrl(value: unknown): value is URL {
  if (typeof value !== "string") return false;

  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
}
