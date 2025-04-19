/* eslint-disable sort-keys */

const rules = {
  /* ### Possible Errors ### */
  "no-await-in-loop": "warn",
  "no-console": [
    //"off",
    "warn",
    //"error",
    {
      //allow: [
      //"warn",
      //"error",
      //],
    },
  ],
  /* ### Best Practices ### */
  "block-scoped-var": "warn",
  "curly": ["error", "all"],
  "consistent-return": ["warn"],
  "default-case": ["error"],
  "dot-location": ["warn", "property"],
  "dot-notation": "warn",
  "eqeqeq": ["warn", "smart"],
  "no-implicit-coercion": [
    "warn",
    {
      boolean: true,
      number: true,
      string: true,
      allow: [
        "!!",
        //"~",
      ],
    },
  ],
  "no-implicit-globals": "error",
  "no-implied-eval": "error",
  "no-loop-func": "error",
  "no-new-wrappers": "error",
  "no-return-assign": ["error", "always"],
  "no-return-await": "error",
  "no-self-compare": "error",
  "no-sequences": "error",
  "no-useless-call": "error",
  "no-useless-return": "warn",
  "require-await": "error",
  "wrap-iife": ["error", "inside"],
  /* ### Strict Mode ### */
  "strict": ["warn", "safe"],
  /* ### Variables ### */
  "no-undef": [
    "error",
    {
      typeof: true,
    },
  ],
  "no-undefined": "off",
  "no-use-before-define": "error",
  /* ### Node.js and CommonJS ### */
  /* ### Stylistic Issues ### */
  "prefer-const": [
    //"off",
    "warn",
    //"error",
    {
      destructuring: "any",
      ignoreReadBeforeAssign: false,
    },
  ],
  "sort-imports": [
    //"off",
    "warn",
    //"error",
    {
      //"allowSeparatedGroups": false, // default
      allowSeparatedGroups: true,
      //ignoreCase: false, // default
      //ignoreDeclarationSort: false, // default
      //ignoreMemberSort: false, // default
      //memberSyntaxSortOrder: ["none", "all", "multiple", "single"], // default
    },
  ],
  "sort-keys": "warn",
  "sort-vars": "warn",
  /* ### ECMAScript 6 ### */
  "no-useless-rename": "warn",
  "no-var": "error",
  "object-shorthand": [
    //"off",
    "warn",
    //"error",
    "always",
    {
      avoidQuotes: true,
    },
  ],
};

export default rules;
