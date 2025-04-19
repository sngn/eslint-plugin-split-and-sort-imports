import { options as options_sort_named_rx } from "../../src/rules/sort-options-named-rx.js";

export const testcase = {
  name: "'named' regular expression",
  code: `
import { default as CapitalizedButNoClass } from "capitalizedImportSource";
import { default as a } from "b";
import { g } from "h";
import { h } from "h";

import { F } from "a";
import { G } from "h";
import H from "h";

// ### Types
import type { D as Da } from "../a";
import type { E } from "a";`,
  options: [options_sort_named_rx],
};
