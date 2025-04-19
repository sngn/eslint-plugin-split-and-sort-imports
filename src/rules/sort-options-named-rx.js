export const options = {
  groupOrder: [
    "style",
    "asset",
    "sideEffect",
    "namespace",
    "named",
    "namedClass",
    "icons",
    "type",
  ],
  groups: {
    named: {
      rxSource: "/capitalizedImportSource$/",
    },
    namedClass: {
      priority: 1,
    },
    type: {
      label: "### Types",
      priority: 0,
    },
  },
  separateGroups: true,
  useLabels: true,
};
