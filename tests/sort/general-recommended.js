import fs from "node:fs";
import { options } from "../../src/rules/sort-options-recommended.js";

const code = fs.readFileSync("./tests/sort/general-invalid.ts").toString();
const output = fs.readFileSync("./tests/sort/general-valid-recommended.ts").toString();

export const testcase = {
  code,
  errors: [{ messageId: "sort-imports" }],
  name: "general - recommended",
  options: [options],
  output,
};
