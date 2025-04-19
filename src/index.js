import fs from "node:fs";
import { options as options_sort_minimal } from "./rules/sort-options-minimal.js";
import { options as options_sort_recommended } from "./rules/sort-options-recommended.js";
import rule_sort from "./rules/sort.js";
import rule_split from "./rules/split.js";

import { URL } from "node:url";

/** @typedef {import("eslint").Linter.Config} Config */
/** @typedef {import("eslint").ESLint.Plugin} Plugin */

const pkg = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const rules = {
  "sort-imports": rule_sort,
  "split-imports": rule_split,
};

/** @type {Plugin} */
const plugin = {
  configs: {},
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules,
};

Object.assign(/** @type {Config} */ (plugin.configs), {
  minimal: [
    {
      plugins: {
        "split-and-sort-imports": plugin,
      },
      rules: {
        "split-and-sort-imports/sort-imports": ["warn", options_sort_minimal],
        "split-and-sort-imports/split-imports": "warn",
      },
    },
  ],
  recommended: [
    {
      plugins: {
        "split-and-sort-imports": plugin,
      },
      rules: {
        "split-and-sort-imports/sort-imports": ["warn", options_sort_recommended],
        "split-and-sort-imports/split-imports": "warn",
      },
    },
  ],
});

export default plugin;
