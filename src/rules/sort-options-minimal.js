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
      priority: -1,
      rxSource: "/\\.(gif|jpe?g|png|webm|webp)$/i",
      sortWhenNoLocalName: true,
    },
    default: {
      priority: -1,
    },
    named: {
      priority: 0,
      sortWhenNoLocalName: true,
    },
    namedClass: {
      priority: -1,
    },
    namespace: {},
    sideEffect: {},
    style: {
      priority: -1,
      rxSource: "/\\.(s?css|less|styl)$/i",
    },
    type: {
      priority: -1,
      sortWhenNoLocalName: true,
    },
  },
  separateGroups: false, // TODO make dependent on sort-imports/allowSeparatedGroups
  useLabels: false,
};
