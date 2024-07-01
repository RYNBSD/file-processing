import { buildSync } from "esbuild";

const DIST = "./dist";

buildSync({
  entryPoints: ["./src/index.ts"],
  tsconfig: "./tsconfig.json",
  legalComments: "external",
  sourcemap: "external",
  packages: "external",
  outdir: DIST,
  logLevel: "info",
  target: "es6",
  platform: "node",
  splitting: true,
  format: "esm",
  minify: true,
  // minifyWhitespace: true,
  // minifySyntax: true,
  bundle: true,
  logLimit: 0,
  drop: ["console", "debugger"],
});
