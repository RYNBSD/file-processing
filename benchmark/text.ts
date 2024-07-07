import type { Result } from "./types.js";
import Core from "../build/core/core.js";
import Text from "../build/core/text.js";

export async function text() {
  const result: Result = {
    load: 0,
    new: 0,
    convert: 0,
    metadata: 0,

    size: 0,
  };

  const dirPath = process.cwd() + "/asset/texts";
  const loadStart = Date.now();
  const files = await Core.loadDir(dirPath);
  const loadEnd = Date.now();

  result.load = loadEnd - loadStart;
  result.size = files.reduce((prev, curr) => prev + curr.length, 0);

  const newStart = Date.now();
  const text = Text.new(files);
  const newEnd = Date.now();
  result.new = newEnd - newStart;

  const convertStart = Date.now();
  await text.compressAsync("gzip");
  const convertEnd = Date.now();
  result.convert = convertEnd - convertStart;

  const metadataStart = Date.now();
  await text.metadata();
  const metadataEnd = Date.now();
  result.metadata = metadataEnd - metadataStart;

  return result;
}
