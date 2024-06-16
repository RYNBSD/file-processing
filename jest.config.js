/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "node",
  testTimeout: 60_000,
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testPathIgnorePatterns: ["node_modules"],
  roots: ["<rootDir>__test__/"],
  testMatch: ["**/__test__/**/*.test.js"],
  // ESM support:
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.m?[tj]s?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};

export default config;
