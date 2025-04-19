// comment above A
/* comment before entirely same line A */ import type { typeA, TypeA } from "./t"; // comment after entirely same line A

/* comment before entirely same line B */import type { typeB, TypeB } from "./t";/* comment after entirely same line B */

/*
 * comment before
 * more lines, ends on same line
 * C, D
 */ import { typeC, type typeD, TypeC, type TypeD } from "./t"; // comment after entirely same line C, D

/* comment above E */
import { type typeE, TypeE } from "./t"; /* comment after
with more lines E */
