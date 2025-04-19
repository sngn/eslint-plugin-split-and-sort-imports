export const options = {
  groupOrder: [
    "style",
    "asset",
    "sideEffect",
    "namespace",
    "default",
    "named",
    "namedClass",
    "type",
  ],
  groups: {
    asset: {
      label: "### Assets",
      priority: 0,
    },
    //"default": {
    //  priority: -1,
    //},
    named: {
      label: "### Named",
    },
    namedClass: {
      label: "### NamedClass",
      priority: 1,
    },
    namespace: {
      label: "### Namespaces",
    },
    sideEffect: {
      label: "### Sideeffects",
    },
    style: {
      label: "### Styles",
      priority: 1,
    },
    type: {
      label: "### Types",
      priority: 0,
    },
  },
  separateGroups: true, // TODO make dependent on sort-imports/allowSeparatedGroups
  useLabels: true,
};
