import fs from "node:fs";
import { options } from "../../src/rules/sort-options-recommended-with-custom-group.js";

const code = fs.readFileSync("./tests/sort/custom-group-with-labels-invalid.ts").toString();
const output = fs.readFileSync("./tests/sort/custom-group-with-labels-valid-recommended.ts").toString();

export const testcase = {
  code,
  errors: [{ messageId: "sort-imports" }],
  name: "custom-group-with-labels - recommended",
  options: [options],
  output,
};
