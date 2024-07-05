import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import security from "eslint-plugin-security";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  security.configs.recommended,
  ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"),
  {
    ignores: ["node_modules/*", "asset/*", "build/*", "coverage/*", "example/*", "tmp/*", "__test__/*", "dist/*"],
  },
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "prettier/prettier": ["error"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-types": "warn",
    },
  },
  {
    files: ["**/.eslintrc.{js,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 5,
      sourceType: "commonjs",
    },
  },
];
