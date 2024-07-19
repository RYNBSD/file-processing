import fs from "node:fs";
import path from "node:path";
import fastGlob from "fast-glob";
import { url2buffer } from "@ryn-bsd/from-buffer-to";

/**
 *  @param paths - file/files path
 *
 * @example
 * ```js
 *  const files = loadFile(["/file.txt", "/image.png"])
 *  // => Buffer[]
 *
 *  const file = loadFile("/file.txt")
 *  // => Buffer
 * ```
 */
export async function loadFile<T extends string>(paths: T): Promise<Buffer>;
export async function loadFile<T extends string[]>(paths: T): Promise<Buffer[]>;
export async function loadFile<T extends string | string[]>(paths: T) {
  if (Array.isArray(paths)) return Promise.all(paths.map((path) => loadFile(path)));
  return fs.promises.readFile(paths);
}

/**
 *  @param paths - directory/directories path
 *
 * @example
 * ```js
 *  const files = loadDir(["/dir1", "/dir2"])
 *  // => Buffer[][]
 *
 *  const file = loadDir("/dir")
 *  // => Buffer[]
 * ```
 */
export async function loadDir<T extends string>(paths: T): Promise<Buffer[]>;
export async function loadDir<T extends string[]>(paths: T): Promise<Buffer[][]>;
export async function loadDir<T extends string | string[]>(paths: T) {
  if (Array.isArray(paths)) return Promise.all(paths.map((path) => loadDir(path)));
  const files = await fs.promises.readdir(paths);
  return loadFile(files.map((file) => path.join(paths, file)));
}

/**
 * @example
 * ```js
 *  loadGlob("/*.txt")
 *  // => (Buffer | Buffer[])[]
 *
 *  loadGlob(["/*.txt", "/images"])
 *  // => (Buffer | Buffer[])[]
 * ```
 */
export async function loadGlob<T extends fastGlob.Pattern | fastGlob.Pattern[]>(
  globs: T,
  options?: fastGlob.Options,
): Promise<(Buffer | Buffer[])[]> {
  const cwd = options?.cwd ?? process.cwd();

  const entries = await fastGlob(globs, options);
  const results = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(cwd, entry);
      const stat = await fs.promises.stat(fullPath);

      if (stat.isFile()) return loadFile(fullPath);
      else if (stat.isDirectory()) return loadDir(fullPath);
      return null;
    }),
  );

  return results.filter((result) => result !== null) as (Buffer | Buffer[])[];
}

/**
 *  @param urls - file/files url
 *
 * @example
 * ```js
 *  const files = loadUrl(["https://example.com/file.text", "https://example.com/image.png"])
 *  // => Buffer[]
 *
 *  const file = loadUrl("https://example.com/file.text")
 *  // => Buffer
 * ```
 */
export async function loadUrl<T extends string | URL>(urls: T): Promise<Buffer>;
export async function loadUrl<T extends string[] | URL[]>(urls: T): Promise<Buffer[]>;
export async function loadUrl<T extends string | URL | string[] | URL[]>(urls: T) {
  if (Array.isArray(urls)) return Promise.all(urls.map((url) => loadUrl(url)));
  return url2buffer(urls);
}
