import type { DirOptions } from "tmp";
import { writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { dir, type DirectoryResult } from "tmp-promise";
import { Node as isFileNode } from "@ryn-bsd/is-file";

/**
 * Create a tmp dir store your files manipulate them and then clean.
 */
export default class TmpFile {
  private readonly files: Buffer[];

  public readonly paths: string[] = [];
  public tmp?: DirectoryResult;

  constructor(...files: Buffer[]) {
    this.files = files;
  }

  private async createFn(file: Buffer) {
    const ext = (await isFileNode.type(file))?.ext ?? "";
    if (ext.length === 0) throw new Error(`${TmpFile.name}: Unknown file when create`);

    const fileName = TmpFile.generateFileName(ext);
    const fullPath = path.join(this.tmp!.path, fileName);

    await writeFile(fullPath, file);
    this.paths.push(fullPath);
  }

  private async create() {
    await Promise.all(this.files.map(this.createFn.bind(this)));
  }

  async init(options?: DirOptions) {
    this.tmp = await dir({ unsafeCleanup: true, ...options });
    await this.create();
    return this as Omit<TmpFile, "init">;
  }

  async clean() {
    await this.tmp!.cleanup();
    this.paths.splice(0, this.paths.length);
  }

  static generateFileName(ext: string) {
    return `${randomUUID()}_${Date.now()}.${ext}`;
  }
}
