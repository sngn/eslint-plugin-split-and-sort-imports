import { options as options_sort_recommended } from "../../src/rules/sort-options-recommended.js";

export const testcase = {
  name: "shortlist - recommended",
  code: `
import { default as a } from "b";
// with comment (b from "a")
import b from "a";
// with multiple comment lines
// comments line (c, d, type C from "./a")
import { c, d, type C } from "./r";
import { lost } from "./lost"; // comment beside lost // comment2 beside lost

import type { D as Da } from "../a";
import type { E } from "a";
// multiple with comment (type F, G from a)
import type { F, G as Ga } from "a";
import type { G } from "h";
import type H from "h";
import { type R, r } from "./a";
import type { aA } from "h";
import type { aa } from "h";
import type { g } from "h";
import type { h } from "h";
`,
  options: [options_sort_recommended],
};
