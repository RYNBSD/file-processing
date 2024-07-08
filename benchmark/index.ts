import type { Benchmark, BenchmarkSchema, CalculateArr, FinalResult, Result } from "./types.js";
import os from "node:os";
import fs from "node:fs";
import { image } from "./image.js";
import { video } from "./video.js";
import { audio } from "./audio";
import { text } from "./text.js";
import { csv } from "./csv.js";
import { pdf } from "./pdf.js";

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
    const pdfs = await pdf();
    const texts = await text();
    const csvs = await csv();
    results.push({ images, videos, audios, pdfs, texts, csvs });
  }

  const benchmarkPath = process.cwd() + "/benchmark.json";

  const oldBenchmark = fs.existsSync(benchmarkPath)
    ? (JSON.parse(fs.readFileSync(benchmarkPath).toString()) as Benchmark)
    : ({} as Benchmark);

  const benchmark: Benchmark = {
    last: oldBenchmark.last,
    new: oldBenchmark.new,
    difference: oldBenchmark?.difference ?? {},
  };

  const newBenchmark: BenchmarkSchema = {
    results,
    calculate: avg(results),
    architecture: {
      platform: os.platform(),
      memory: os.freemem(),
      cpus: os.cpus()[0].model,
      cores: os.cpus().length,
      hostname: os.hostname(),
      arch: os.arch(),
    },
  };

  if (typeof benchmark.new === "object" && typeof benchmark.last === "object") {
    benchmark.last = benchmark.new;
    benchmark.new = newBenchmark;
  } else if (typeof benchmark.new === "undefined" && typeof benchmark.last === "undefined")
    benchmark.last = newBenchmark;
  else if (typeof benchmark.new === "undefined" && typeof benchmark.last === "object") benchmark.new = newBenchmark;
  else if (typeof benchmark.new === "object" && typeof benchmark.last === "undefined") {
    benchmark.last = benchmark.new;
    benchmark.new = newBenchmark;
  } else {
    benchmark.last = newBenchmark;
    benchmark.new = undefined;
  }

  Object.entries(benchmark.last.calculate.avg).forEach(([key]) => {
    const lastAvg = benchmark.last?.calculate.avg[key] ?? 0;
    const newAvg = benchmark.new?.calculate.avg[key] ?? 0;

    benchmark.difference![key] = lastAvg === 0 ? 0 : 100 - (newAvg * 100) / lastAvg;
    benchmark.difference![key] = Number.parseFloat(benchmark.difference![key].toFixed(2));
  });

  fs.writeFileSync(benchmarkPath, JSON.stringify(benchmark, null, 4));
}

main();
