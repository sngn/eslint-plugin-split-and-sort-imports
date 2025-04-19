# @sngn/eslint-plugin-split-and-sort-imports

## 0.4.0

### Minor Changes

- f7ef4ea: Change of license. MIT -> GPLv3

### Patch Changes

- 5bedb42: updated dependencies

## 0.3.0

### Minor Changes

- ae9198f: Changed (fixed) the sorting methodology to sort like (default) sort-imports.
  Used to sort "aA" after "aa". Now capital letters are sorted before lowercase ones.
  This also removes configuration options that start with `localeCompare_`.

### Patch Changes

- 1504b17: update dev dependencies
- df51c7b: Updated README

## 0.2.1

### Patch Changes

- 28bac1a: Updated README

## 0.2.0

### Breaking Changes

- 5022893: Changed sorting functions to actually sort like 'sort-imports' demands (ALL imports with capital letters before lowercase imports)
  Renamed option 'localeCompare_locale' to 'localeCompare_locales' and allow for it to be an array
