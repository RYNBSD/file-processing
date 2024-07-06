import Core from "../build/core/core.js";
import Video from "../build/core/av/video.js";

export async function video() {
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
  const files = await Core.loadDir(process.cwd() + "/asset/videos");
  const loadEnd = Date.now();
  result.load.time = loadEnd - loadStart;
  result.load.size = files.reduce((prev, curr) => prev + curr.length, 0);

  const newStart = Date.now();
  const video = await Video.new(files);
  const newEnd = Date.now();
  result.new = newEnd - newStart;

  const convertStart = Date.now();
  // Why (webp)?, because it is the standard/preferred for web
  await video.convert("mkv");
  const convertEnd = Date.now();
  result.convert = convertEnd - convertStart;

  const metadataStart = Date.now();
  await video.metadata();
  const metadataEnd = Date.now();
  result.metadata = metadataEnd - metadataStart;

  return result;
}
