/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type { InputFiles } from "../types/index.js";
import { Readable, Stream } from "node:stream";
export declare function input2buffer(input: InputFiles): Promise<Buffer | null>;
export declare function isArrayOfBuffer(array: unknown[]): array is Buffer[];
export declare function isArrayOfString(array: unknown[]): array is string[];
export declare function isStream(value: unknown): value is Stream;
export declare function isReadable(value: unknown): value is Readable;
export declare function isUrl(value: unknown): value is URL;
//# sourceMappingURL=fn.d.ts.map