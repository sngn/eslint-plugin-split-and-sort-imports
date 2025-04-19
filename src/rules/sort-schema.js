/** @type {import("eslint").Rule.RuleMetaData["schema"]} */
export const schema = {
  $defs: {
    group: {
      additionalProperties: false,
      properties: {
        label: {
          description: "Label for the group",
          type: "string",
        },
        priority: {
          description:
            "If two or more groups are a match for a given import, groups with higher priority 'win'. Defaults to 0. Negative numbers disable the group. Some groups cannot be disabled (named, namespace, sideEffect)",
          type: "integer",
        },
        rxSource: {
          description:
            "String representation of a regular expression that selects the imports for this group. Matches against 'source' string of import",
          pattern: "^/.*/[a-z]*$",
          type: "string",
        },
        sortWhenNoLocalName: {
          description: "Sort imports in this group as if they had no side effects",
          type: "boolean",
        },
      },
      type: "object",
    },
  },
  items: [
    {
      additionalProperties: false,
      properties: {
        groupOrder: {
          description:
            "Specifiese the order in which the group blocks appear. Groups not listed will be appended, sorted by 'name'",
          items: { type: "string" },
          type: "array",
        },
        groups: {
          description:
            "Defines additional groups imports can belong to. Keys of this object are the group names.",
          patternProperties: { ".*": { $ref: "#/$defs/group" } },
          type: "object",
        },
        separateGroups: {
          description: "Whether to separate group blocks by a newline",
          type: "boolean",
        },
        useLabels: {
          description:
            "Whether to insert a comment containing the groups label at the beginning of the groups block",
          type: "boolean",
        },
      },
      type: "object",
    },
  ],
  maxItems: 1,
  minItems: 0,
  type: "array",
};
