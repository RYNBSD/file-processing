import stream from "node:stream";

export default abstract class Core {
  constructor() {}

  abstract get length(): number;

  abstract append(...buffers: Buffer[]): Promise<number>;
  abstract extend(...cors: unknown[]): number;
  abstract clone(): Core;
  abstract clean(): void;

  abstract filter(): Promise<number>;
  abstract metadata(): Promise<unknown>;

  // abstract stream(): Promise<void>;

  /**
   * @param readable - input
   * @param writable - output or middleware
   *
   * @example
   * ```js
   *  const writable = Core.stream(readable, transform)
   *  // => Writable
   *
   *  writable.pipe(output)
   * ```
   */
  static stream(readable: stream.Readable, writable: stream.Writable) {
    return readable.pipe(writable);
  }

  /**
   * @deprecated use loader.loadFile() from helper
   *
   * @param paths - file/files path
   *
   * @example
   * ```js
   *  const files = Core.loadFile(["/file.txt", "/image.png"])
   *  // => Buffer[]
   *
   *  const file = Core.loadFile("/file.txt")
   *  // => Buffer
   * ```
   */
  // static async loadFile<T extends string>(paths: T): Promise<Buffer>;
  // static async loadFile<T extends string[]>(paths: T): Promise<Buffer[]>;
  // static async loadFile<T extends string | string[]>(paths: T) {
  //   if (Array.isArray(paths)) return Promise.all(paths.map((path) => Core.loadFile(path)));
  //   return fs.promises.readFile(paths);
  // }

  /**
   * @deprecated use loader.loadDir() from helper
   *
   * @param paths - directory/directories path
   *
   * @example
   * ```js
   *  const files = Core.loadDir(["/dir1", "/dir2"])
   *  // => Buffer[][]
   *
   *  const file = Core.loadDir("/dir")
   *  // => Buffer[]
   * ```
   */
  // static async loadDir<T extends string>(paths: T): Promise<Buffer[]>;
  // static async loadDir<T extends string[]>(paths: T): Promise<Buffer[][]>;
  // static async loadDir<T extends string | string[]>(paths: T) {
  //   if (Array.isArray(paths)) return Promise.all(paths.map((path) => Core.loadDir(path)));
  //   const files = await fs.promises.readdir(paths);
  //   return Core.loadFile(files.map((file) => path.join(paths, file)));
  // }

  /**
   * @deprecated  use loader.loadGlob() from helper
   *
   * @example
   * ```js
   *  Core.loadGlob("/*.txt")
   *  // => (Buffer | Buffer[])[]
   *
   *  Core.loadGlob(["/*.txt", "/images"])
   *  // => (Buffer | Buffer[])[]
   * ```
   */
  // static async loadGlob<T extends fastGlob.Pattern | fastGlob.Pattern[]>(
  //   globs: T,
  //   options?: fastGlob.Options,
  // ): Promise<(Buffer | Buffer[])[]> {
  //   const entries = await fastGlob(globs, options);
  //   const cwd = options?.cwd ?? process.cwd();

  //   const results = await Promise.all(
  //     entries.map(async (entry) => {
  //       const fullPath = path.join(cwd, entry);
  //       const stat = await fs.promises.stat(fullPath);

  //       if (stat.isFile()) return Core.loadFile(fullPath);
  //       else if (stat.isDirectory()) return Core.loadDir(fullPath);
  //       return null;
  //     }),
  //   );

  //   return results.filter((result) => result !== null) as (Buffer | Buffer[])[];
  // }

  /**
   * @deprecated  use loader.loadUrl() from helper
   *
   *  @param urls - file/files url
   *
   * @example
   * ```js
   *  const files = Core.loadUrl(["https://example.com/file.text", "https://example.com/image.png"])
   *  // => Buffer[]
   *
   *  const file = Core.loadUrl("https://example.com/file.text")
   *  // => Buffer
   * ```
   */
  // static async loadUrl<T extends string | URL>(urls: T): Promise<Buffer>;
  // static async loadUrl<T extends string[] | URL[]>(urls: T): Promise<Buffer[]>;
  // static async loadUrl<T extends string | URL | string[] | URL[]>(urls: T) {
  //   if (Array.isArray(urls)) return Promise.all(urls.map((url) => Core.loadUrl(url)));
  //   return url2buffer(urls);
  // }

  /**
   * @deprecated use parser.toBuffer() from helper
   *
   * @param input - any type of supported inputs
   *
   * @example
   * ```js
   *  Core.toBuffer("cnluYnNk")
   *  Core.toBuffer("/file.text")
   *  Core.toBuffer("https://example.com/file.text")
   * ```
  //  */
  // static async toBuffer<T extends InputFiles>(input: T): Promise<Buffer>;
  // static async toBuffer<T extends InputFiles[]>(input: T): Promise<Buffer[]>;
  // static async toBuffer<T extends InputFiles | InputFiles[]>(input: T) {
  //   if (Array.isArray(input)) return Promise.all(input.map((i) => Core.toBuffer(i)));

  //   if (Buffer.isBuffer(input)) return input;
  //   else if (isUrl(input)) return Core.loadUrl(input);
  //   else if (isUint8Array(input)) return uint8array2buffer(input);
  //   else if (isAnyArrayBuffer(input)) return array2buffer(input);
  //   else if (isStream(input)) return stream2buffer(input);
  //   else if (isReadableStream(input)) return readablestream2buffer(input);
  //   else if (isReadable(input) && Readable.isReadable(input)) return readable2buffer(input);
  //   else if (typeof input === "string") {
  //     const fileStat = await fs.promises.stat(input);
  //     if (fileStat.isFile()) return Core.loadFile(input);
  //     else if (isBase64(input, { allowEmpty: false })) return Buffer.from(input, "base64");
  //     return string2buffer(input, false);
  //   }
  //   return any2buffer(input);
  // }

  /**
   * @deprecated use parser.toReadable() from helper
   *
   * Convert any type of inputs to Readable
   *
   * @example
   * ```js
   *  Core.toReadable("cnluYnNk")
   *  Core.toReadable("/file.text")
   *  Core.toReadable("https://example.com/file.text")
   * ```
   */
  // static async toReadable<T extends InputFiles>(input: T): Promise<Readable>;
  // static async toReadable<T extends InputFiles[]>(input: T): Promise<Readable[]>;
  // static async toReadable<T extends InputFiles | InputFiles[]>(input: T) {
  //   if (Array.isArray(input)) return Promise.all(input.map((i) => Core.toReadable(i)));
  //   if (isReadable(input) && Readable.isReadable(input)) return input;
  //   const buffer = await Core.toBuffer(input);
  //   return buffer2readable(buffer);
  // }

  /**
   * @deprecated use parser.toBase64() from helper
   *
   * Convert any type of inputs into base64 | base64url
   *
   * @example
   * ```js
   *  Core.toBase64("cnluYnNk")
   *  Core.toBase64("/file.text")
   *  Core.toBase64("https://example.com/file.text")
   * ```
   */
  // static async toBase64<T extends InputFiles>(input: T, encoding?: "base64" | "base64url"): Promise<string>;
  // static async toBase64<T extends InputFiles[]>(input: T, encoding?: "base64" | "base64url"): Promise<string[]>;
  // static async toBase64<T extends InputFiles | InputFiles[]>(input: T, encoding: "base64" | "base64url" = "base64") {
  //   if (Array.isArray(input)) return Promise.all(input.map((i) => Core.toBase64(i)));
  //   if (typeof input === "string" && isBase64(input)) return input;
  //   const buffer = await Core.toBuffer(input);
  //   return buffer.toString(encoding);
  // }

  /**
   * @deprecated use parser.toFile() from helper
   *
   * Save any type of inputs into file
   *
   * @example
   * ```js
   *  Core.toFile(
   *    [
   *      {
   *        path: "where-to-store.txt",
   *        input: Buffer.alloc(1)
   *      }
   *    ]
   *  )
   * ```
   */
  // static async toFile(file: { path: string; input: InputFiles }[]) {
  //   await Promise.all(
  //     file.map(async (f) => {
  //       const buffer = await Core.toBuffer(f.input);
  //       return fs.promises.writeFile(f.path, buffer);
  //     }),
  //   );
  // }
}
