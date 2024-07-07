import type { CalculateArr, FinalResult, Result } from "./types.js";
import fs from "fs/promises";
import { image } from "./image.js";
import { video } from "./video.js";
import { audio } from "./audio";
import { text } from "./text.js";
import { csv } from "./csv.js";

//? How min/max/avg are sorted (time in millisecond and size in byte)
function calculate({ load, new: newTimer, convert, metadata, size }: Result) {
  return (load + newTimer + convert + metadata) / size;
}

function calculateFn(results: FinalResult[], callback: (arr: CalculateArr[]) => CalculateArr) {
  const arr: CalculateArr[] = [];

  results.forEach((result) => {
    const obj: CalculateArr = {};
    Object.entries(result).forEach(([key, value]) => {
      obj[key] = calculate(value);
    });
    arr.push(obj);
  });

  return callback(arr);
}

function min(results: FinalResult[]) {
  return calculateFn(results, (arr) => {
    const min: CalculateArr = {};

    arr.forEach((ar) => {
      Object.entries(ar).forEach(([key, value]) => {
        if (!min[key]) {
          min[key] = value;
          return;
        }
        min[key] = value < min[key] ? value : min[key];
      });
    });

    return min;
  });
}

function max(results: FinalResult[]) {
  return calculateFn(results, (arr) => {
    const max: CalculateArr = {};

    arr.forEach((ar) => {
      Object.entries(ar).forEach(([key, value]) => {
        if (!max[key]) {
          max[key] = value;
          return;
        }
        max[key] = value > max[key] ? value : max[key];
      });
    });

    return max;
  });
}

function avg(results: FinalResult[]) {
  const mi = min(results);
  const ma = max(results);
  const avg: CalculateArr = {};

  Object.keys(mi).forEach((key) => {
    avg[key] = (mi[key] + ma[key]) / 2;
  });

  return { min: mi, max: ma, avg };
}

async function main() {
  const results: FinalResult[] = [];

  for (let i = 0; i < 10; i++) {
    const images = await image();
    const videos = await video();
    const audios = await audio();
    const texts = await text();
    const csvs = await csv();
    results.push({ images, videos, audios, texts, csvs });
  }

  await fs.writeFile(process.cwd() + "/benchmark.json", JSON.stringify({ results, ...avg(results) }, null, 4));
}

main();
