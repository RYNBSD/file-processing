import fs from "fs/promises";
import { image } from "./image.js";
import { video } from "./video.js";

function min(results) {

}

function max() {

}

function avg() {
  const result = {
    load: {
      time: 0,
      size: 0
    },
  }
}

async function main() {
  const results = {};

  for (let i = 0; i < 10; i++) {
    const [images, videos] = await Promise.all([image(), video()]);
    results[i] = { images, videos };
  }

  await fs.writeFile("./benchmark.json", JSON.stringify(results, null, 4));
}

main();
