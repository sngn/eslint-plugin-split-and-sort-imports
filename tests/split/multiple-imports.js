import fs from "node:fs";

const code = fs.readFileSync("./tests/split/multiple-imports-invalid.ts").toString();
const output = fs.readFileSync("./tests/split/multiple-imports-valid.ts").toString();

export const testcase = {
  code,
  errors: [
    { messageId: "split-import" },
    { messageId: "split-import" },
    { messageId: "split-import" },
  ],
  name: "multiple-imports",
  output,
};
