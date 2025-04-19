/** @typedef {import("@typescript-eslint/types").TSESTree.ImportDeclaration} ImportDeclaration */
/** @typedef {import("estree").ImportDeclaration} ImportDeclarationX */
/** @typedef {import("@typescript-eslint/types").TSESTree.ImportSpecifier} ImportSpecifier */
/** @typedef {import("eslint").Rule.RuleContext} RuleContext */
/** @typedef {import("eslint").Rule.RuleModule} RuleModule */

/**
 * @param {object} params Parameters
 * @param {RuleContext} params.context
 */
function handlerImportDeclaration(params) {
  const { context } = params;

  /**
   * @param {ImportDeclarationX} node
   */
  function func(node) {
    if (node.specifiers.length > 1) {
      const sourceCode = context.sourceCode;
      const importStrings = node.specifiers.map((specifier) => {
        return (
            /** @type {ImportSpecifier} */ (specifier).importKind === "type" ||
              /** @type {ImportDeclaration} */ (node).importKind === "type"
          ) ?
            `import type { ${sourceCode.getText(specifier).replace("type ", "")} } from "${node.source.value}";`
          : `import { ${sourceCode.getText(specifier)} } from "${node.source.value}";`;
      });

      context.report({
        fix: (fixer) => {
          return fixer.replaceText(node, importStrings.join("\n"));
        },
        messageId: "split-import",
        node,
      });
    }
  }

  return {
    func,
  };
}

/** @type {RuleModule} */
const ruleModule = {
  create: (context) => {
    return {
      "ImportDeclaration[specifiers.length > 1]": handlerImportDeclaration({
        context,
      }).func,
    };
  },
  meta: {
    docs: {
      description: "Require one line per import, disallow multiple imports",
    },
    fixable: "code",
    messages: {
      "split-import": "Split multiple import into single imports",
    },
    type: "suggestion",
  },
};

export default ruleModule;
