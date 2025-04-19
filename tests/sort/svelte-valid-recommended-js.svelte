<script context="module">
import { importA } from "./a";

import { ImportA } from "a";

export const someConst = "someConst";
</script>

<script>
import { jmportA } from "./a";

import { JmportA } from "a";

export let prop1 = false;
export let propA;
export let propB;

const someConst2 = "someConst2";
</script>

<div on:click={jmportA} on:focus={importA}>
  {someConst2}
</div>

<ImportA />
<JmportA />
