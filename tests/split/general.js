import fs from "node:fs";

const code = fs.readFileSync("./tests/split/general-invalid.ts").toString();
const output = fs.readFileSync("./tests/split/general-valid.ts").toString();

export const testcase = {
  code,
  errors: [
    { messageId: "split-import" },
    { messageId: "split-import" },
    { messageId: "split-import" },
  ],
  name: "general",
  output,
};
