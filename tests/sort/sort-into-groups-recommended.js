import { options } from "../../src/rules/sort-options-recommended.js";

export const testcase = {
  code: `
import "./sideeffectImport.js";
import "assets.png";
import "styles.css";
import * as ns from "namespace";
import ClassB from "a";
import asset from "asset.png";
import b from "a";
import styles from "styles.module.css";
import type { B } from "./a";
import { ClassC } from "./c";
import { c } from "./c";
import { default as ClassA } from "b";
import { default as a } from "b";
import { default as styles2 } from "styles2.module.css";
import { type A } from "./b";
`,
  errors: [{ messageId: "sort-imports" }],
  name: "sort-into-groups - recommended",
  options: [options],
  output: `
import "styles.css";
import styles from "styles.module.css";
import { default as styles2 } from "styles2.module.css";

import "assets.png";
import asset from "asset.png";

import "./sideeffectImport.js";

import * as ns from "namespace";

import { default as a } from "b";
import b from "a";
import { c } from "./c";

import { default as ClassA } from "b";
import ClassB from "a";
import { ClassC } from "./c";

import { type A } from "./b";
import type { B } from "./a";
`,
};
