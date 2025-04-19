<script context="module" lang="ts">
import { importA } from "./a";

import { ImportA } from "a";

import type { TImportA } from "./b";
import type { TImportB } from "b";

export const someConst = "someConst";
</script>

<script lang="ts">
import { jmportA } from "./a";

import { JmportA } from "a";

import type { TJmportA } from "./a";
import type { TJmportB } from "b";

export let prop1 = false;
export let propA: TJmportA;
export let propB: TJmportB;

const someConst2 = "someConst2";
</script>

<div on:click={jmportA} on:focus={importA}>
  {someConst2}
</div>

<ImportA />
<JmportA />
