import fs from "fs/promises";
import { image } from "./image.js";

export async function main() {
  const [images] = await Promise.all([image()]);

  await fs.writeFile("./benchmark.json", JSON.stringify({ images }, null, 4));
}

main();
