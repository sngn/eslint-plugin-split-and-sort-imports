/** @type {import("prettier").Config["plugins"]} */
const plugins = [];

/** @type {import("prettier").Config} */
const config = {
  experimentalTernaries: true,
  overrides: [
    {
      files: "[jt]sconfig.json",
      options: {
        parser: "jsonc",
      },
    },
  ],
  plugins,
  printWidth: 92,
  quoteProps: "consistent",
  singleAttributePerLine: true,
  trailingComma: "all", // default
};

export default config;
