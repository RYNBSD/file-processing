import Core from "../build/core/core.js";
import Image from "../build/core/image.js";

export async function image() {
  const result = {
    load: {
      time: 0,
      size: 0,
    },
    new: 0,
    convert: 0,
    metadata: 0,
  };

  const loadStart = Date.now();
  const files = await Core.loadDir(process.cwd() + "/asset/images");
  const loadEnd = Date.now();
  result.load.time = loadEnd - loadStart;
  result.load.size = files.reduce((prev, curr) => prev + curr.length, 0);

  const newStart = Date.now();
  const image = await Image.new(files);
  const newEnd = Date.now();
  result.new = newEnd - newStart;

  const convertStart = Date.now();
  // Why (webp)?, because it is the standard/preferred for web
  await image.convert("webp", { quality: 100, alphaQuality: 100 });
  const convertEnd = Date.now();
  result.convert = convertEnd - convertStart;

  const metadataStart = Date.now();
  await image.metadata();
  const metadataEnd = Date.now();
  result.metadata = metadataEnd - metadataStart;

  return result;
}
