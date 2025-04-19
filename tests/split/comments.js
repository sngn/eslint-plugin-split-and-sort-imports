import fs from "node:fs";

const code = fs.readFileSync("./tests/split/comments-invalid.ts").toString();
const output = fs.readFileSync("./tests/split/comments-valid.ts").toString();

export const testcase = {
  code,
  errors: [
    { messageId: "split-import" },
    { messageId: "split-import" },
    { messageId: "split-import" },
    { messageId: "split-import" },
  ],
  name: "comments",
  output,
};
