import { default as eslintjs } from "@eslint/js";
//import { fileURLToPath } from "node:url";
import { default as globals } from "globals";
import { default as jsdoc } from "eslint-plugin-jsdoc";
//import { default as path } from "node:path";
import { default as prettierRecommended } from "eslint-plugin-prettier/recommended";
import { default as rules } from "./eslint.rules.js";
import { default as splitAndSortImports } from "./src/index.js";
import { default as tseslint } from "typescript-eslint";

// ### ### ###

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

export default tseslint.config(
  eslintjs.configs.recommended,
  jsdoc.configs["flat/recommended"],
  prettierRecommended,
  ...(splitAndSortImports.configs?.recommended ?? {}),
  {
    /* prettier-ignore */
    ignores: [
      ".gitignore",
      "dist/**/*",
      "tests/**/*",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    rules: {
      ...rules,
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-property-description": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-returns-description": "off",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
    },
  },
  /* prettier-ignore */
  { // eslint config files
    files: [
      "eslint.config.js",
      "eslint.rules.js",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "module",
    },
  },
);
