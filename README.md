# eslint-plugin-split-and-sort-imports

An eslint plugin that sorts imports and splits 'multiple' imports into single line imports.

## Why

I could not find a plugin that sorts imports according to eslint's [sort-imports](https://eslint.org/docs/latest/rules/sort-imports) rule (sorting by imported name) that also works for 'type' imports and svelte files. This plugin should do all that.

## How

When **split-imports** rule is enabled, lines like this

```ts
import type { F, G as Ga } from "a";
```

will be transformed into

```ts
import type { F } from "a";
import type { G as Ga } from "a";
```

When **sort-imports** rule is enabled, imports will be sorted into groups, which are then arranged as blocks of imports.
Each of these blocks will be sorted alphabetically by local import name. So code like this

```js
import { r } from "./a";
import b from "a";
import { default as a } from "b";
```

will be (for example - can be adjusted) transformed into

```js
import { default as a } from "b";
import b from "a";
import { r } from "./a";
```

The exception are imports where order might be important, namely imports of the form `import "./sideeffects.js";`  
These are not sorted by default and original order is maintained.

The plugin looks at the code between the first and last imports (including comments associated with these imports), say lines `n` to `m`, does its thing and replaces lines `n` to `m` with the result.

### Import groups

Imports are categorized and placed into an 'import group'. Custom groups can be configured.

The built-in import groups are

- `asset` - for static assets such as pictures
- `default` - for 'default' imports of the form `import fs from "node:fs";`
- `named` - for named imports, ie `import { r } from "./a";`
- `namedClass` - for named imports that start with a capital letter, ie `import { R } from "./a";`
- `namespace` - for namespace imports, ie `import * as fs from "node:fs";`
- `sideEffect` - for imports of the form `import "./sideeffects.js";`
- `style` - for imports of css files and the like
- `type` - for imports of types

### Comments

Regarding comments in code, the plugin tries to be as unobtrusive as possible.
So comments will in general stay where they are.

Comments that end on the line directly above a node will stay with that node.  
Comments that end on the same line as the start of the node will stay with that node.  
Comments that start on the same line as the end of the node will stay with that node.

Also, for all but the first import, comments above, that are not associated with another import, will be associated with that import, even if there are newlines separating. See [examples](#examples) for how this works in practice.

## Installation and Usage

In `eslint.config.js`, import the plugin

```js
import splitAndSortImports from "@sngn/eslint-plugin-split-and-sort-imports";
```

Then add plugin configuration.

Like this for a minimal config

```js
export default [
  /* ... other stuff */
  ...splitAndSortImports.configs.minimal,
  /* ... other stuff */
];
```

or with recommended options

```js
export default [
  /* ... other stuff */
  ...splitAndSortImports.configs.recommended,
  /* ... other stuff */
];
```

Or customize... this example separates import groups with a newline and enables the "type" group.

```js
export default [
  /* ... other stuff */
  {
    plugins: {
      "split-and-sort-imports": plugin,
    },
    rules: {
      "split-and-sort-imports/sort-imports": [
        "warn",
        { groups: { type: { priority: 0 } }, separateGroups: true },
      ],
      "split-and-sort-imports/split-imports": "warn",
    },
  },
  /* ... other stuff */
];
```

## Rules

### sort-imports

This rule sorts imports according to the [sort-imports](https://eslint.org/docs/latest/rules/sort-imports) rule.  
It does not sort 'multiple' imports, as the eslint rule already does that, and also doesn't sort them before 'single' imports (it doesn't fix the "Expected 'multiple' syntax before 'single' syntax" message). Although that is not an issue if 'split-imports' is enabled.  
This rule is auto-fixable.

#### Configuration

##### groupOrder

Defines the order of the import blocks. Missing blocks will be appended at the end.
The default is:

```
groupOrder: [
  "style",
  "asset",
  "sideEffect",
  "namespace",
  "default",
  "named",
  "namedClass",
  "type",
]
```

##### groups

Configures the available groups. Some groups are built-in. Custom groups can also be configured.

Keys of this object are the group names. Values are [`group`](#groupobject) objects.

There are three standard groups, than cannot be disabled.  
When all other groups are disabled, all imports fall into one of these groups.  
These groups are

- named - ie `import { xyz } from "..."`
- namespace - ie `import * as xyz from "..."`
- sideEffect - ie `import "path/to/somefile"`, imports are not sorted by default.

Then there are the following other groups, all of which are disabled when using 'minimal' config.

- default - this group can be used for 'default' imports ("ImportDefaultSpecifier"s).  
  It is special in that, if you want to gather default imports extra from named imports, you have to use this group. This cannot be achieved with regular expressions.  
  This group needs to have a higher priority than 'named' group for it to be enabled.  
  This group needs to have a higher priority than 'namedClass' group for it to gather capitalized 'default' imports.

- namedClass - when using 'recommended' config, this group gathers imports whose 'local name' starts with a capital letter.  
  It is not possible to further split them apart, with rxSource for example (as these match against the source, not the import name).  
  This group needs to have a higher priority than 'named' group for it to be enabled.

- type - when using 'recommended' config, this group is used for 'type' imports.  
  It is not possible to further split them apart.

- asset - when using 'recommended' config, this group is used for imports of 'static' assets (pictures and the like)
  that have no side effects.  
  Otherwise there is nothing special about this group.  
  Adjust `rxSource` for this group (or submit PR) to add more file types to this group.

- style - when using 'recommended' config, this group is used for imports of 'style' assets (css files and the like).  
  'sideEffect' type imports are not sorted by default.  
  Otherwise there is nothing special about this group.  
  Adjust `rxSource` for this group (or submit PR) to add more file types to this group.

##### separateGroups

Default `false`. When this is `true`, import blocks will be separated from one another by a newline

##### useLabels

Default `false`. When set to `true`, and an import group has a label set, the import block will be preceded by a comment containing the label. So if the label is '### Label for an import group', it looks like this:

```js
// ### Label for an import group
```

This feature is not very sophisticated, so use with care. Meaning that when you add a new import that goes to the top of the import group after sorting, then the label comment will be added to the top of the block, while the previous top import also will retain the comment. Might fix this in the future.

#### 'group' object

```ts
interface Group {
  label?: string;
  priority?: number;
  rxSource?: string;
  sortWhenNoLocalName?: boolean;
}
```

##### label

The label for the group. See [useLabels](#uselabels)

##### priority

Defaults to `0`.
When more than one regular expression from different groups matches, then the group with higher priority wins. Negative value disables the group.
There are three standard groups, than cannot be disabled. When all other groups are disabled, all imports fall into one of these groups. These groups are

- named
- namespace
- sideEffect

##### rxSource

String representation of a regular expression that selects the imports for this group. It is matched against the source string (the string 'source' in `import ... from "source"`).

This must be a string that starts and ends with `/`, as a regular expression would. This string will be fed to `new RegExp`, so escape accordingly. Example:

```js
rxSource: "/\\.s?css/";
```

##### sortWhenNoLocalName

Defaults to `false`.
When `true` imports in this group are handled as if they had no sideeffects.  
For instance, if you set this on "style" group, 'sideEffect' type imports are sorted, otherwise not.

### split-imports

When enabled, this rule splits lines with 'multiple' import syntax into single lines.
There is no further configuration.  
This rule is auto-fixable.

## Examples

The plugin with recommended rules enabled turns this code

<!-- prettier-ignore -->
```ts
/* comment at beginning of file */

// with comment (test.png)
import "test.png"; // comment beside test.png
// with comment (b from "a")
import b from "a";
// with multiple comment lines
// comments line (c, d, type C from "./a")
import { c, d, type C } from "./r";
import { type R, r } from "./a";
import * as fs from "node:fs";
import { ClassD } from "classE";
import type { D as Da } from "../a";

import type { E } from "a";
import { ClassE } from "classD";
/* comment before inline Test.gif */import "Test.gif";
import test4 from "test.webp";
import test2 from "test2.webp";
import ClassB from "classA";
import ClassA from "classB";
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
// multiple with comment (type F, G from a)
import type { F, G as Ga } from "a";
import * as _ from "lodash";
import type H from "h";
import type { G } from "h";
import "./sideeffects2.js";
import type { g } from "h";
import type { h } from "h";
import "./sideeffects1.js";

// comment for otherExport
const otherExport = "something";
/* multiline
 * comment
 */
const otherExport2 = "something else";

import { lost } from "./lost"; // comment beside lost // comment2 beside lost

export function someFunction() {
  console.log(otherExport, otherExport2);
}
```

into this

<!-- prettier-ignore -->
```ts
/* comment at beginning of file */

/*
 * multiline comment before test2.css
 * multiline comment line 2 test2.css
 *
 */ import "test2.css";
import "test.css"; // comment 1 after test.css//comment 2 after test.css
import styles_a from "testb.scss";
import styles_b from "testa.scss";

/* comment before inline Test.gif */import "Test.gif";
// with comment (test.png)
import "test.png"; // comment beside test.png
import "test3.png";
import test2 from "test2.webp";
import test4 from "test.webp";

import "./sideeffects2.js";
import "./sideeffects1.js";

import * as _ from "lodash";
import * as fs from "node:fs";

import { default as a } from "b";
// with comment (b from "a")
import b from "a";
// with multiple comment lines
// comments line (c, d, type C from "./a")
import { c } from "./r";
import { d } from "./r";
import { lost } from "./lost"; // comment beside lost // comment2 beside lost
import { r } from "./a";

import ClassA from "classB";
import ClassB from "classA";
import { ClassD } from "classE";
import { ClassE } from "classD";

import type { C } from "./r";
import type { D as Da } from "../a";
import type { E } from "a";
// multiple with comment (type F, G from a)
import type { F } from "a";
import type { G } from "h";
import type { G as Ga } from "a";
import type H from "h";
import type { R } from "./a";
import type { g } from "h";
import type { h } from "h";

// comment for otherExport
const otherExport = "something";
/* multiline
 * comment
 */
const otherExport2 = "something else";

export function someFunction() {
  console.log(otherExport, otherExport2);
}
```

## State of plugin and future

The plugin should be functional and safe to use, but I am not so happy with the grouping functionality (`rxSource` for instance).
I will try to improve this.  
So the configuration interface is not yet stable.  
When I am happy with everything, I will push the version to `1`. So for now, minor version changes almost certainly signify a breaking change.
