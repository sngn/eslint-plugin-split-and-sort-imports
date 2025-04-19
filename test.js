import rule_sort from "./src/rules/sort.js";
import rule_split from "./src/rules/split.js";
import { testcase as tc_sort_custom_group_with_labels_recommended } from "./tests/sort/custom-group-with-labels-recommended.js";
import { testcase as tc_sort_general_minimal } from "./tests/sort/general-minimal.js";
import { testcase as tc_sort_general_recommended } from "./tests/sort/general-recommended.js";
import { testcase as tc_sort_into_groups_recommended } from "./tests/sort/sort-into-groups-recommended.js";
import { testcase as tc_sort_into_groups_with_labels_recommended } from "./tests/sort/sort-into-groups-with-labels-recommended.js";
import { testcase as tc_sort_named_rx } from "./tests/sort/named-rx.js";
import { testcase as tc_sort_shortlist_minimal } from "./tests/sort/shortlist-minimal.js";
import { testcase as tc_sort_shortlist_recommended } from "./tests/sort/shortlist-recommended.js";
import { testcase as tc_split_comments } from "./tests/split/comments.js";
import { testcase as tc_split_general } from "./tests/split/general.js";
import { testcase as tc_split_multiple_imports } from "./tests/split/multiple-imports.js";
import { testcase as tc_split_peculiar_names } from "./tests/split/peculiar-names.js";

import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester();

ruleTester.run("sort", rule_sort, {
  invalid: [
    tc_sort_custom_group_with_labels_recommended,
    tc_sort_general_minimal,
    tc_sort_general_recommended,
    tc_sort_into_groups_recommended,
    tc_sort_into_groups_with_labels_recommended,
  ],
  valid: [tc_sort_shortlist_minimal, tc_sort_shortlist_recommended, tc_sort_named_rx],
});

ruleTester.run("split", rule_split, {
  invalid: [
    tc_split_comments,
    tc_split_general,
    tc_split_multiple_imports,
    tc_split_peculiar_names,
  ],
  valid: [
    {
      code: `import { G as Ga } from "a";`,
      name: "single import",
    },
    {
      code: `import type { G as Ga } from "a";`,
      name: "single type import",
    },
  ],
});
