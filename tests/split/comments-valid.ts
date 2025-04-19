// comment above A
/* comment before entirely same line A */ import type { typeA } from "./t";
import type { TypeA } from "./t"; // comment after entirely same line A

/* comment before entirely same line B */import type { typeB } from "./t";
import type { TypeB } from "./t";/* comment after entirely same line B */

/*
 * comment before
 * more lines, ends on same line
 * C, D
 */ import { typeC } from "./t";
import type { typeD } from "./t";
import { TypeC } from "./t";
import type { TypeD } from "./t"; // comment after entirely same line C, D

/* comment above E */
import type { typeE } from "./t";
import { TypeE } from "./t"; /* comment after
with more lines E */
