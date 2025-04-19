/* comment at beginning of file */

// with comment (test.png)
import "test.png"; // comment beside test.png
// with comment (b from "a")
import b from "a";
// with multiple comment lines
// comments line (c, d, type C from "./a")
import { c, d, type C } from "./r";
import { type R, r } from "./a";
import { PencilSimple } from "phosphor-svelte";
import { Eye } from "phosphor-svelte";
import * as fs from "node:fs";
import type { D as Da } from "../a";

import type { E } from "a";
/* comment before inline Test.gif */import "Test.gif";
import test4 from "test.webp";
import test2 from "test2.webp";
import "test3.png";
import { default as a } from "b";
/*
 * multiline comment before test2.css
 * multiline comment line 2 test2.css
 *
 */ import "test2.css";
import styles_b from "testa.scss";
import styles_a from "testb.scss";

import "test.css"; // comment 1 after test.css//comment 2 after test.css
import { ArrowsClockwise } from "phosphor-svelte";
// multiple with comment (type F, G from a)
import type { F, G as Ga } from "a";
import * as _ from "lodash";
import type H from "h";
import type { G } from "h";
import type { g } from "h";
import type { h } from "h";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PlusSquare } from "phosphor-svelte";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { CheckCircle } from "phosphor-svelte";
import "./sideeffects2.js";
import { CircleNotch } from "phosphor-svelte";
import "./sideeffects1.js";

// comment for otherExport
const otherExport = "something";
/* multiline
 * comment
 */
const otherExport2 = "something else";

import { lost } from "./lost"; // comment beside lost // comment2 beside lost

export function openJson() {
  console.log(otherExport, otherExport2);
}
