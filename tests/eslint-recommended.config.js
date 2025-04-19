import { fileURLToPath } from "url";
import { default as parserTs } from "@typescript-eslint/parser";
import { default as path } from "node:path";
import { default as splitAndSortImports } from "../src/index.js";
import { default as svelte } from "eslint-plugin-svelte";
import { default as tseslint } from "typescript-eslint";

// ### ### ###

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join("..", path.dirname(__filename));

export default [
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/base"],
  ...(splitAndSortImports.configs?.recommended ?? {}),
  {
    rules: {
      "sort-imports": ["warn", { allowSeparatedGroups: true }],
    },
  },
  {
    files: ["*.svelte", "**/*.svelte"],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".svelte"],
        parser: parserTs,
        project: "../tsconfig-tests.json",
        tsconfigRootDir: __dirname,
      },
      sourceType: "module",
    },
  },
];
