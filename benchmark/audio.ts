import type { Result } from "./types.js";
import Core from "../build/core/core.js";
import Audio from "../build/core/av/audio.js";

export async function audio() {
  const result: Result = {
    load: 0,
    new: 0,
    convert: 0,
    metadata: 0,

    size: 0,
  };

  const dirPath = process.cwd() + "/asset/audios";
  const loadStart = Date.now();
  const files = await Core.loadDir(dirPath);
  const loadEnd = Date.now();

  result.load = loadEnd - loadStart;
  result.size = files.reduce((prev, curr) => prev + curr.length, 0);

  const newStart = Date.now();
  const audio = await Audio.new(files);
  const newEnd = Date.now();
  result.new = newEnd - newStart;

  const convertStart = Date.now();
  await audio.convert("wav");
  const convertEnd = Date.now();
  result.convert = convertEnd - convertStart;

  const metadataStart = Date.now();
  await audio.metadata();
  const metadataEnd = Date.now();
  result.metadata = metadataEnd - metadataStart;

  return result;
}
