import fs from "node:fs";

const code = fs.readFileSync("./tests/split/peculiar-names-invalid.ts").toString();
const output = fs.readFileSync("./tests/split/peculiar-names-valid.ts").toString();

export const testcase = {
  code,
  errors: [
    { messageId: "split-import" },
    { messageId: "split-import" },
    { messageId: "split-import" },
    { messageId: "split-import" },
  ],
  name: "peculiar-names",
  output,
};
