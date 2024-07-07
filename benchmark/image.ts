import type { Result } from "./types.js";
import Core from "../build/core/core.js";
import Image from "../build/core/image.js";

export async function image() {
  const result: Result = {
    load: 0,
    new: 0,
    convert: 0,
    metadata: 0,

    size: 0,
  };

  const dirPath = process.cwd() + "/asset/images";
  const loadStart = Date.now();
  const files = await Core.loadDir(dirPath);
  const loadEnd = Date.now();

  result.load = loadEnd - loadStart;
  result.size = files.reduce((prev, curr) => prev + curr.length, 0);

  const newStart = Date.now();
  const image = await Image.new(files);
  const newEnd = Date.now();
  result.new = newEnd - newStart;

  const convertStart = Date.now();
  await image.convert("webp", { quality: 100, alphaQuality: 100 });
  const convertEnd = Date.now();
  result.convert = convertEnd - convertStart;

  const metadataStart = Date.now();
  await image.metadata();
  const metadataEnd = Date.now();
  result.metadata = metadataEnd - metadataStart;

  return result;
}
