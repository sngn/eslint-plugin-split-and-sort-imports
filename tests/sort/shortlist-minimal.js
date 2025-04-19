import { options as options_sort_minimal } from "../../src/rules/sort-options-minimal.js";

export const testcase = {
  name: "shortlist - minimal",
  code: `
import type { D as Da } from "../a";
import type { E } from "a";
// multiple with comment (type F, G from a)
import type { F, G as Ga } from "a";
import type { G } from "h";
import type H from "h";
import { type R, r } from "./a";
import { default as a } from "b";
import type { aA } from "h";
import type { aa } from "h";
// with comment (b from "a")
import b from "a";
// with multiple comment lines
// comments line (c, d, type C from "./a")
import { c, d, type C } from "./r";
import type { g } from "h";
import type { h } from "h";
import { lost } from "./lost"; // comment beside lost // comment2 beside lost
`,
  options: [options_sort_minimal],
};
