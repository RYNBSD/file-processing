/// <reference types="node" resolution-mode="require"/>
import type { InputFiles } from "../types/index.js";
/**
 * @deprecated
 * Call:
 * ```js
 *  Core.toBuffer();
 * ```
 */
export declare function input2buffer(input: InputFiles): Promise<Buffer | null>;
export declare function isArrayOfBuffer(array: unknown[]): array is Buffer[];
export declare function isArrayOfString(array: unknown[]): array is string[];
export declare function isUrl(value: unknown): value is URL;
//# sourceMappingURL=fn.d.ts.map
