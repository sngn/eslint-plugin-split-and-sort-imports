import { options as options_sort_minimal } from "./sort-options-minimal.js";
import { schema } from "./sort-schema.js";

import { AST_NODE_TYPES } from "@typescript-eslint/types";

/** @typedef {import("../generated/sort-schema.d.ts").Group} Group */
/** @typedef {import("../generated/sort-schema.d.ts").SortSchema} SortSchema */
/** @typedef {import("@typescript-eslint/types").TSESTree.Comment} Comment */
/** @typedef {import("@typescript-eslint/types").TSESTree.ImportClause} ImportClause */
/** @typedef {import("@typescript-eslint/types").TSESTree.ImportDeclaration} ImportDeclaration */
/** @typedef {import("@typescript-eslint/types").TSESTree.ImportSpecifier} ImportSpecifier */
/** @typedef {import("@typescript-eslint/types").TSESTree.Node} Node */
/** @typedef {import("@typescript-eslint/types").TSESTree.ProgramStatement} ProgramStatement */
/** @typedef {import("@typescript-eslint/types").TSESTree.Program} Program */
/** @typedef {import("@typescript-eslint/types").TSESTree.Range} Range */
/** @typedef {import("@typescript-eslint/types").TSESTree.SourceLocation} SourceLocation */
/** @typedef {import("@typescript-eslint/types").TSESTree.TSModuleBlock} TSModuleBlock */
/** @typedef {import("eslint").Rule.RuleContext} RuleContext */
/** @typedef {import("estree").Comment} CommentX */
/** @typedef {import("estree").ImportDeclaration} ImportDeclarationX */
/** @typedef {import("estree").Node} NodeX */
/** @typedef {import("estree").Program} ProgramX */
/** @typedef {import("estree").SourceLocation} SourceLocationX */

/** @typedef {(Program|ProgramStatement)} ExtractableNode */
/** @typedef {("asset"|"named"|"namedClass"|"namespace"|"sideEffect"|"style"|"type")} ImportGroup */
/** @typedef {ProgramStatement[]} OtherDeclarations */

/**
 * @typedef {object} Extracted
 * @property {ImportDeclaration[]} ids
 * @property {OtherDeclarations} ods
 * @property {[ExtractableNode, Extracted][]} sub
 */

/** @typedef {(ImportDeclaration | ProgramStatement | string)} TemplateItem */

const labelMarker = "___<<<label>>>___";
const rx_labelmarker = new RegExp(`^${labelMarker}`);
const rx_labelmarker_g = new RegExp(labelMarker, "g");

/** @type {SortSchema} */
const defaultOptionsArray = [options_sort_minimal];
const defaultOptions0 = defaultOptionsArray[0];
const defaultOptions = /** @type {Required<typeof defaultOptions0>} */ (defaultOptions0);

/**
 * Flattens a sub array, so that so entries have no subs
 * @param {[ExtractableNode, Extracted][]} acc
 * @param {[ExtractableNode, Extracted]} sb - sub entry
 * @returns {[ExtractableNode, Extracted][]}
 */
function flatten_sub(acc, sb) {
  acc.push([
    sb[0],
    {
      ids: sb[1].ids,
      ods: sb[1].ods,
      sub: [],
    },
  ]);

  if (sb[1].sub.length) {
    acc = sb[1].sub.reduce(flatten_sub, acc);
  }

  return acc;
}

/**
 * @param {SourceLocation} loc
 * @returns {string}
 */
function locToString(loc) {
  return `--${loc.start.line}/${loc.start.column}--${loc.end.line}/${loc.end.column}--`;
}

/**
 * @param {ExtractableNode} node
 * @returns {Extracted}
 */
function extract_and_file(node) {
  /** @type {ImportDeclaration[]} */
  const ids = [];
  /** @type {OtherDeclarations} */
  const ods_pre = [];
  /** @type {[ExtractableNode, Extracted][]} */
  const sub_pre = [];

  if ("body" in node && Array.isArray(node.body)) {
    node.body.forEach((bodyNode) => {
      if (bodyNode.type === AST_NODE_TYPES.ImportDeclaration) {
        ids.push(bodyNode);
      } else {
        ods_pre.push(bodyNode);

        if ("body" in bodyNode && Array.isArray(bodyNode.body)) {
          const nb_extracted = extract_and_file(bodyNode);

          if (nb_extracted.ids.length || nb_extracted.sub.length) {
            sub_pre.push([bodyNode, nb_extracted]);
          }
        }
      }
    });
  }

  const rangeLast = ids.at(-1)?.range ?? [NaN, NaN];

  const ods =
    ids.length ?
      /* prettier-ignore */
      ods_pre.filter((d) => (/** @type {Node} */ (d).range.at(0) ?? NaN) < rangeLast[1])
    : [];
  const sub = sub_pre.reduce(flatten_sub, []);

  return { ids, ods, sub };
}

/**
 * @param {object} _params Parameters
 * @param {RuleContext} _params.context
 */
function handlerProgram(_params) {
  //const { context } = params;

  /** @type {Extracted} */
  const extracted = { ids: [], ods: [], sub: [] };

  /**
   * @param {ProgramX} program
   */
  function funcProgram(program) {
    const extracted_program = extract_and_file(/** @type {Program} */ (program));

    Object.assign(extracted, extracted_program);
  }

  return {
    extracted,
    func: funcProgram,
  };
}

/**
 * @param {object} params Parameters
 * @param {RuleContext} params.context
 * @returns {typeof defaultOptions} - 'Unified' options - options passed to plugin augmented with default options
 */
function getOptions({ context }) {
  const contextOptionsArray = /** @type {SortSchema} */ (context.options);
  const contextOptions = contextOptionsArray.at(0);

  const unified_groups =
    contextOptions?.groups ?
      Object.entries(contextOptions.groups).reduce(
        (acc, [key, groupdef]) => {
          acc[key] = {
            ...(defaultOptions.groups[
              /** @type {keyof defaultOptions["groups"]} */ (key)
            ] ?? {}),
            ...groupdef,
          };

          return acc;
        },
        { ...defaultOptions.groups },
      )
    : defaultOptions.groups;

  return {
    ...defaultOptions,
    ...contextOptions,
    groups: unified_groups,
  };
}

/**
 * @param {RuleContext} context
 * @param {ImportDeclaration} d
 * @returns {string} - name of an import group
 */
function getGroup(context, d) {
  const moduleName = String(d.source.value ?? "no_module_name");
  const options = getOptions({ context });

  const { groups: oGroups } = options;

  const groups = Object.entries(oGroups ?? {}).reduce(
    (acc, [gname, cg]) => {
      acc[gname] = {
        ...(acc[gname] ?? {}),
        ...cg,
      };

      return acc;
    },
    { ...defaultOptions.groups },
  );
  /** @type {keyof typeof groups} */
  let rv;
  /* eslint-disable-next-line dot-notation */
  const useGroup_type = (groups["type"]?.priority ?? 0) >= 0;
  const specifier = d.specifiers.at(0);

  if (
    useGroup_type &&
    (d.importKind === "type" ||
      /** @type {undefined|ImportSpecifier} */ (specifier)?.importKind === "type")
  ) {
    rv = "type";
  } else {
    /** @type {(undefined | keyof typeof groups)} */
    let group = undefined;

    const groupsWithRxSource = Object.entries(groups)
      .filter(([_gname, g]) => !!g.rxSource && (g.priority ?? 0) >= 0)
      .sort((a, b) => {
        const prioA = a[1].priority ?? 0;
        const prioB = b[1].priority ?? 0;

        const diff = prioA - prioB;

        return (
          diff === 0 ?
            a[0] < b[0] ? -1
            : a[0] === b[0] ? 0
            : 1
          : diff
        );
      });

    for (let i = 0; i < groupsWithRxSource.length; i++) {
      const groupEntry = /** @type {[string, Group]} */ (groupsWithRxSource[i]);
      const groupOptions = groupEntry[1];

      const rxSource = /** @type {string} */ (groupOptions.rxSource);
      const i_lastSlash = rxSource.lastIndexOf("/") ?? -1;

      const rx = new RegExp(
        rxSource.slice(1, i_lastSlash),
        i_lastSlash > -1 ? rxSource.slice(i_lastSlash + 1) : "",
      );

      if (rx.test(moduleName)) {
        group = groupEntry[0];
        break;
      }
    }

    if (!group) {
      if (d.specifiers?.length) {
        /* eslint-disable-next-line dot-notation */
        const prio_default = groups["default"]?.priority ?? 0;
        /* eslint-disable-next-line dot-notation */
        const prio_named = groups["named"]?.priority ?? 0;
        /* eslint-disable-next-line dot-notation */
        const prio_namedClass = groups["namedClass"]?.priority ?? 0;
        const specifier = /** @type {ImportClause} */ (d.specifiers.at(0));

        const lname = specifier.local.name;

        const lname_is_lowercase = lname[0] === (lname[0] ?? "").toLowerCase();

        switch (specifier.type) {
          case "ImportDefaultSpecifier":
            group =
              lname_is_lowercase ?
                prio_default > 0 && prio_default > prio_named ?
                  "default"
                : "named"
              : prio_default > 0 && prio_default > prio_namedClass ?
                prio_named >= prio_default ?
                  "named"
                : "default"
              : prio_namedClass >= 0 ?
                prio_named >= prio_namedClass ?
                  "named"
                : "namedClass"
              : "named";
            break;
          case "ImportNamespaceSpecifier":
            group = "namespace";
            break;
          //case "ImportSpecifier":
          default:
            group =
              lname_is_lowercase ? "named"
              : prio_namedClass >= 0 ?
                prio_named >= prio_namedClass ?
                  "named"
                : "namedClass"
              : "named";
            break;
        }
      } else {
        group = "sideEffect";
      }
    }

    rv = group;
  }

  return rv;
}

/**
 * @param {ReturnType<typeof getOptions>} _options
 */
function sorter_noSortWithoutLName(_options) {
  /**
   * @param {ImportDeclaration} a
   * @param {ImportDeclaration} b
   * @returns {number}
   */
  return function (a, b) {
    const a_lname = a.specifiers?.at(0)?.local?.name;
    const a_src = a.source.value;
    const a_cmp = a_lname ?? a_src;

    const b_lname = b.specifiers?.at(0)?.local?.name;
    const b_src = b.source.value;
    const b_cmp = b_lname ?? b_src;

    return (
      a_lname && !b_lname ? 1
      : !a_lname && b_lname ? -1
      : !(a_lname || b_lname) ? 0
      : a_cmp < b_cmp ? -1
      : a_cmp === b_cmp ? 0
      : 1
    );
  };
}

/**
 * @param {ReturnType<typeof getOptions>} _options
 */
function sorter(_options) {
  /**
   * @param {ImportDeclaration} a - Parameter description.
   * @param {ImportDeclaration} b - Parameter description.
   * @returns {number}
   */
  return function (a, b) {
    const a_lname = a.specifiers?.at(0)?.local?.name;
    const a_src = a.source.value;
    const a_cmp = a_lname ?? a_src;

    const b_lname = b.specifiers?.at(0)?.local?.name;
    const b_src = b.source.value;
    const b_cmp = b_lname ?? b_src;

    return (
      a_lname && !b_lname ? 1
      : !a_lname && b_lname ? -1
      : a_cmp < b_cmp ? -1
      : a_cmp === b_cmp ? 0
      : 1
    );
  };
}

/**
 * Sorts ImportDeclarations into groups
 * @param {object} params Parameters
 * @param {RuleContext} params.context
 * @param {Extracted} params.extracted
 * @returns {Record<string, ImportDeclaration[]>} - keys are input groups
 */
function getGroups(params) {
  const { context, extracted } = params;
  const options = getOptions(params);

  const { ids } = extracted;
  const { groups: oGroups } = options;

  const groups = Object.entries(oGroups ?? {}).reduce(
    (acc, [gname, cg]) => {
      acc[gname] = {
        ...(acc[gname] ?? {}),
        ...cg,
      };

      return acc;
    },
    { ...(options.groups ?? {}) },
  );
  /** @type {Set<string>} */
  const touchedGroups = new Set();

  /* distribute to groups */

  const templategroups = ids.reduce((acc, d) => {
    const gname = getGroup(context, d);
    const gname_arr = acc[gname] ?? /** @type {ImportDeclaration[]} */ ([]);

    gname_arr.push(d);
    touchedGroups.add(gname);

    acc[gname] = gname_arr;

    return acc;
  }, /** @type {Record<string, ImportDeclaration[]>} */ ({}));

  /* sort templategroups */
  [...touchedGroups].forEach((gname) => {
    const group = /** @type {Group} */ (groups[gname]);
    const templategroup = /** @type {ImportDeclaration[]} */ (templategroups[gname]);

    ///** @type {ImportDeclaration[]} */(templategroups[g]).sort(["asset", "type"].includes(g) ? sorter : sorter_noSortWithoutLName);
    templategroup.sort(
      group.sortWhenNoLocalName ? sorter(options) : sorter_noSortWithoutLName(options),
    );
  });

  return templategroups;
}

/**
 * @param {object} params Parameters
 * @param {RuleContext} params.context
 * @param {Extracted} params.extracted
 * @returns {TemplateItem[]}
 */
function createTemplate(params) {
  const { context, extracted } = params;
  const groups = getGroups(params);
  const options = getOptions(params);
  const options_default = /** @type {typeof options_sort_minimal} */ (defaultOptions);

  const {
    groupOrder = options_default.groupOrder,
    separateGroups = options_default.separateGroups,
    useLabels = options_default.useLabels,
  } = options;
  const { ods: otherDeclarations } = extracted;

  const nonEmptyGroups = Object.entries(groups).filter(([_gname, idarr]) => idarr.length);
  /** @type {Set<string>} */
  const unprocessedGroups_names = nonEmptyGroups.reduce((acc, [gname]) => {
    return acc.add(gname);
  }, new Set());

  const separator = separateGroups ? "" : undefined;

  /**
   * @param {(undefined | TemplateItem)[]} acc
   * @param {string} gname - group name
   * @returns {(undefined | TemplateItem)[]}
   */
  function grouporderreducer(acc, gname) {
    const group = groups[gname] ?? [];

    if (group.length) {
      const groupLabel =
        useLabels ?
          /** @type {Record<string, Group>} */ (options.groups)[gname]?.label
        : undefined;
      const labelComment_content = `// ${groupLabel}`;
      const labelComment_content_with_marker = labelMarker + labelComment_content;
      const labelComment_exists = (function () {
        /** @type {boolean} */
        let rv;

        if (useLabels && groupLabel) {
          const sourceCode = context.sourceCode;
          const first_id = /** @type {ImportDeclarationX} */ (group[0]);
          const comments = sourceCode.getCommentsBefore(first_id);

          if (comments.length) {
            const first_comment = /** @type {Comment} */ (
              /** @type {unknown} */ (comments[0])
            );
            const content = sourceCode
              .getText(/** @type {NodeX} */ (/** @type {unknown} */ (first_comment)))
              .trim();

            rv = content === labelComment_content;
          } else {
            rv = false;
          }
        } else {
          rv = true;
        }

        return rv;
      })();

      const useLabels_addition =
        labelComment_exists ? [] : [labelComment_content_with_marker];

      acc = [...acc, ...useLabels_addition, ...group, separator];
    }

    /* mark group as processed */
    unprocessedGroups_names.delete(gname);

    return acc;
  }

  const arr = groupOrder
    .reduce(grouporderreducer, /** @type {(undefined | TemplateItem)[]} */ ([]))
    .concat(
      [...unprocessedGroups_names]
        .sort()
        .reduce(grouporderreducer, /** @type {(undefined | TemplateItem)[]} */ ([])),
    )
    .concat(["", ...otherDeclarations]);
  const arr_filtered = /** @type {TemplateItem[]} */ (
    arr.filter((item) => typeof item !== "undefined")
  );

  const assembled = arr_filtered.reduce((acc, v) => {
    const pushEntry = (acc.length && v !== acc.at(-1)) || (!acc.length && v !== "");

    if (pushEntry) {
      acc.push(v);
    }

    return acc;
  }, /** @type {typeof arr_filtered} */ ([]));

  const rv = assembled.at(-1) === "" ? assembled.slice(0, -1) : assembled;

  return rv;
}

/**
 * @param {object} params Parameters
 * @param {RuleContext} params.context
 * @param {Extracted} params.extracted
 */
function report(params) {
  const { context, extracted } = params;
  const { ids, ods } = extracted;

  const id0 = /** @type {ImportDeclaration} */ (ids.at(0));
  const id_1 = /** @type {ImportDeclaration} */ (ids.at(-1));
  const od0 = /** @type {undefined | Node} */ (ods.at(0));
  const od_1 = /** @type {undefined | Node} */ (ods.at(-1));
  const options = getOptions(params);
  const sourceCode = context.sourceCode;
  const template = createTemplate(params);

  /** @type {Comment | Node } */
  const first_node =
    od0 ?
      id0.range[0] < od0.range[0] ?
        id0
      : od0
    : id0;
  /** @type {Comment | Node } */
  const last_node =
    od_1 ?
      id_1.range[0] < od_1.range[0] ?
        od_1
      : id_1
    : id_1;

  let first_loc_start = first_node.loc.start;
  let first_range0 = first_node.range[0];
  let last_loc_end = last_node.loc.end;
  let last_range1 = last_node.range[1];

  /** @type {Set<string>} */
  const comments_processed = new Set();

  const generated = template
    .map((d) => {
      if (typeof d === "string") {
        return d;
      } else {
        /** @type {(CommentX | NodeX)[]} */
        let arr;
        const comments_before = sourceCode.getCommentsBefore(/** @type {NodeX} */ (d));
        const comments_after = sourceCode.getCommentsAfter(/** @type {NodeX} */ (d));
        const comments_after_reduced = comments_after.reduce((acc, c) => {
          if (c.loc?.start.line === d.loc.end.line) {
            acc.push(c);
          }

          return acc;
        }, /** @type {typeof comments_after} */ ([]));

        /* mark as processed */
        comments_after_reduced.forEach((c) => {
          comments_processed.add(locToString(/** @type {SourceLocation} */ (c.loc)));
        });

        if (d === first_node) {
          /** @type {(CommentX | NodeX)[]} */
          const local_arr = [/** @type {NodeX} */ (d)];
          for (let i = comments_before.length; i > 0; i--) {
            const comment = /** @type {CommentX} */ (comments_before[i - 1]);

            if (comment.range && comment.loc) {
              const c_loc = comment.loc;
              const comment_on_same_or_above_line = [
                c_loc.end.line,
                c_loc.end.line + 1,
              ].includes(first_loc_start.line);
              const comment_unprocessed = !comments_processed.has(locToString(c_loc));

              if (comment_on_same_or_above_line) {
                if (comment_unprocessed) {
                  first_loc_start = comment.loc.start;
                  first_range0 = /** @type {number} */ (comment.range?.at(0));

                  local_arr.push(comment);
                }
              } else {
                break;
              }
            } else {
              break;
            }
          }

          arr = local_arr.reverse();
        } else {
          if (d === last_node && comments_after_reduced.length) {
            last_loc_end = /** @type {SourceLocationX} */ (
              /** @type {CommentX} */ (comments_after_reduced.at(-1)).loc
            ).end;
            last_range1 = /** @type {number} */ (
              /** @type {Range} */ (
                /** @type {CommentX} */ (comments_after_reduced.at(-1)).range
              ).at(1)
            );
          }

          const comments_before_filtered = comments_before.filter(
            (c) => c.loc && !comments_processed.has(locToString(c.loc)),
          );

          arr = [...comments_before_filtered, /** @type {NodeX} */ (d)];
        }

        const sc_arr = arr.reduce((acc, node, i, a) => {
          const sc = sourceCode.getText(/** @type {NodeX} */ (node));

          if (i === 0) {
            acc += sc;
          } else {
            const last_loc = /** @type {SourceLocation} */ (
              /** @type {typeof node} */ (a.at(i - 1)).loc
            );
            const loc = /** @type {SourceLocation} */ (node.loc);

            const last_end_column = last_loc.end.column;
            const last_end_line = last_loc.end.line;
            const start_column = loc.start.column;
            const start_line = loc.start.line;

            if (last_end_line === start_line) {
              const diff = start_column - last_end_column;

              for (let i = 0; i < diff; i++) {
                acc += " ";
              }

              acc += sc;
            } else {
              acc += `\n${sc}`;
            }
          }

          return acc;
        }, "");
        const sc_comments_after = comments_after_reduced
          .map((c) => sourceCode.getText(/** @type {NodeX} */ (/** @type {unknown} */ (c))))
          .join(" ");

        return [sc_arr, sc_comments_after].filter((e) => e).join(" ");
      }
    })
    .join("\n");

  const loc = {
    end: last_loc_end,
    start: first_loc_start,
  };
  /** @type {Range} */
  const range = [first_range0, last_range1];

  const idx_end = sourceCode.getIndexFromLoc(loc.end);
  const idx_start = sourceCode.getIndexFromLoc(loc.start);

  const current_sc = sourceCode.getText().slice(idx_start, idx_end);
  const compareCode =
    options.useLabels ?
      generated
        .split("\n")
        .filter((l) => !rx_labelmarker.test(l))
        .join("\n")
    : generated;
  const reportCode =
    options.useLabels ? generated.replaceAll(rx_labelmarker_g, "") : generated;

  if (compareCode !== current_sc && reportCode !== current_sc) {
    context.report({
      fix(fixer) {
        return fixer.replaceTextRange(range, reportCode);
      },
      loc,
      messageId: "sort-imports",
    });
  }
}

/**
 * @param {object} params Parameters
 * @param {RuleContext} params.context
 * @param {Extracted} params.extracted
 */
function handlerProgramExit(params) {
  const { context, extracted } = params;

  /**
   * @param {ProgramX} _program
   */
  return function (_program) {
    if (extracted.ids.length) {
      report({
        context,
        extracted,
      });
    }

    if (extracted.sub.length) {
      extracted.sub.forEach((sb) => {
        report({
          context,
          extracted: sb[1],
        });
      });
    }
  };
}

/** @type {import("eslint").Rule.RuleModule} */
const ruleModule = {
  create(context) {
    const h_program = handlerProgram({ context });
    const h_ProgramExit = handlerProgramExit({
      context,
      ...h_program,
    });

    return {
      "Program": h_program.func,
      "Program:exit": h_ProgramExit,
    };
  },
  meta: {
    docs: {
      description: "Enforce sorted import declarations within modules",
    },
    fixable: "code",
    messages: {
      "sort-imports": "Sort imports",
    },
    schema,
    type: "suggestion",
  },
};

export default ruleModule;
