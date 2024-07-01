/// <reference types="node" resolution-mode="require"/>
import type { DirOptions } from "tmp";
import { type DirectoryResult } from "tmp-promise";
/**
 * Create a tmp dir store your files manipulate them and then clean.
 */
export default class TmpFile {
  private readonly files;
  readonly paths: string[];
  tmp?: DirectoryResult;
  constructor(...files: Buffer[]);
  private createFn;
  private create;
  init(options?: DirOptions): Promise<Omit<TmpFile, "init">>;
  clean(): Promise<void>;
  static generateFileName(ext: string): string;
}
//# sourceMappingURL=tmp.d.ts.map
