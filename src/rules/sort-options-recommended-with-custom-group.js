export const options = {
  groupOrder: [
    "style",
    "asset",
    "sideEffect",
    "namespace",
    "default",
    "named",
    "namedClass",
    "icons",
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
    icons: {
      label: "### Icons",
      priority: 1,
      rxSource: "/^(@fortawesome|@phosphor|phosphor-)/",
    },
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
      priority: 2,
    },
    type: {
      label: "### Types",
      priority: 0,
    },
  },
  separateGroups: true,
  useLabels: true,
};
