// @ts-check
import path from "path";
import { fileURLToPath } from "url";

import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import etc from "eslint-plugin-etc";
import jsdoc from "eslint-plugin-jsdoc";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import eslintTs from "typescript-eslint";

const project = "./tsconfig.json";
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: eslintJs.configs.recommended,
});

/**
 * @param {string} name the pugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
function legacyPlugin(name, alias = name) {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  return fixupPluginRules(plugin);
}

export default eslintTs.config(
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommendedTypeChecked,
  ...compat.extends("plugin:import/typescript"),
  reactRecommended,
  sonarjs.configs.recommended,
  stylistic.configs.customize({
    braceStyle: "1tbs",
    flat: true,
    quotes: "double",
    semi: true,
  }),
  {
    ignores: [
      ".yarn/**",
      "**/.bundle/**",
      "**/android/**",
      "**/build/**",
      "**/dist/**",
      "**/ios/**",
      "**/node_modules/**",
      "**/public/**",
      "**/vendor/**",
    ],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2024,
        jsxPragma: null,
        project,
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    plugins: {
      "better-styled-components": legacyPlugin("better-styled-components"),
      deprecation: legacyPlugin("eslint-plugin-deprecation", "deprecation"),
      etc: fixupPluginRules(etc),
      "extra-rules": legacyPlugin("eslint-plugin-extra-rules", "extra-rules"),
      import: legacyPlugin("eslint-plugin-import", "import"),
      jsdoc,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project,
        },
      },
      react: {
        version: "detect",
      },
    },
  },
  {
    rules: {
      "@stylistic/arrow-parens": ["error", "as-needed"],
      "@stylistic/indent": "off",
      "@stylistic/indent-binary-ops": "off",
      "@stylistic/jsx-curly-brace-presence": ["error", { children: "always" }],
      "@stylistic/jsx-curly-newline": "off",
      "@stylistic/jsx-pascal-case": ["error", { allowNamespace: true }],
      "@stylistic/jsx-props-no-multi-spaces": "error",
      "@stylistic/jsx-self-closing-comp": "error",
      "@stylistic/jsx-wrap-multilines": ["error", { prop: "ignore" }],
      "@stylistic/linebreak-style": "error",
      "@stylistic/max-len": ["error", {
        code: 120,
        comments: 80,
        ignorePattern: "^import (\\{ )?\\w+( \\})? from \".+\";$",
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
        tabWidth: 2,
      }],
      "@stylistic/member-delimiter-style": ["error", { singleline: { requireLast: true } }],
      "@stylistic/no-extra-semi": "error",
      "@stylistic/no-mixed-spaces-and-tabs": "error",
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/padded-blocks": ["error", "never", { allowSingleLineBlocks: false }],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": ["error", "double", {
        allowTemplateLiterals: false,
        avoidEscape: true,
      }],
      "@stylistic/space-before-function-paren": ["error", { anonymous: "never", named: "never" }],
      "@stylistic/switch-colon-spacing": "error",
      "@typescript-eslint/ban-types": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-exports": "off",
      "@typescript-eslint/consistent-type-imports": ["off", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/member-ordering": ["error", {
        classes: [
          "static-field",
          "field",
          "constructor",
          "static-method",
          "abstract-method",
          "protected-method",
          "public-method",
          "private-method",
        ],
        interfaces: { order: "alphabetically" },
        typeLiterals: { order: "alphabetically" },
      }],
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-inferrable-types": ["error", {
        ignoreParameters: true,
        ignoreProperties: true,
      }],
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-redundant-type-constituents": "error",
      "@typescript-eslint/no-shadow": ["error", { hoist: "all" }],
      "@typescript-eslint/no-unused-expressions": ["error", { allowTernary: true }],
      "@typescript-eslint/no-unused-vars": ["error", {
        destructuredArrayIgnorePattern: "^_",
        ignoreRestSiblings: true,
      }],
      "@typescript-eslint/no-use-before-define": ["error", {
        classes: false,
        functions: false,
      }],
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/only-throw-error": "error",
      "@typescript-eslint/parameter-properties": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/restrict-template-expressions": ["error", {
        allowBoolean: true,
        allowNullish: true,
        allowNumber: true,
      }],
      "@typescript-eslint/triple-slash-reference": "error",
      "@typescript-eslint/unbound-method": ["error", { ignoreStatic: true }],
      "@typescript-eslint/unified-signatures": "error",
      "better-styled-components/sort-declarations-alphabetically": "error",
      camelcase: "error",
      "constructor-super": "error",
      curly: "error",
      "deprecation/deprecation": "error",
      eqeqeq: "error",
      "etc/no-assign-mutated-array": "error",
      "etc/no-internal": "error",
      "extra-rules/no-commented-out-code": "error",
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "import/newline-after-import": "error",
      "import/no-absolute-path": "error",
      "import/no-cycle": ["error", {
        allowUnsafeDynamicCyclicDependency: true,
        ignoreExternal: true,
        maxDepth: 1,
      }],
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "import/no-import-module-exports": "error",
      "import/no-namespace": "error",
      "import/no-relative-packages": "error",
      "import/no-unresolved": "error",
      "import/no-useless-path-segments": "error",
      "import/order": ["error", {
        alphabetize: {
          caseInsensitive: false,
          order: "asc",
          orderImportKind: "asc",
        },
        groups: [
          "builtin",
          ["external", "internal"],
          "parent",
          "sibling",
          "index",
          "type",
        ],
        "newlines-between": "always",
      }],
      "jsdoc/check-alignment": "error",
      "jsdoc/check-indentation": ["error", { excludeTags: ["example", "param", "returns"] }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
      "max-classes-per-file": ["error", 1],
      "no-caller": "error",
      "no-cond-assign": "error",
      "no-console": "error",
      "no-duplicate-imports": "error",
      "no-empty-function": "error",
      "no-eval": "error",
      "no-extra-boolean-cast": ["error", { enforceForLogicalOperands: true }],
      "no-inner-declarations": ["error", "both"],
      "no-invalid-this": "error",
      "no-labels": "error",
      "no-new-wrappers": "error",
      "no-param-reassign": "error",
      "no-throw-literal": "off",
      "no-underscore-dangle": "error",
      "no-use-before-define": "off",
      "no-useless-computed-key": ["error", { enforceForClassMembers: true }],
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-const": "error",
      radix: "error",
      "react/display-name": "off",
      "react/hook-use-state": "error",
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-no-bind": "error",
      "react/jsx-no-literals": "error",
      "react/prop-types": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/no-inverted-boolean-check": "error",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "sort-keys": "error",
    },
  },
  {
    files: ["**/*.?(c|m)js"],
    languageOptions: {
      parserOptions: {
        programs: null,
        project: false,
      },
    },
    rules: {
      ...eslintTs.configs.disableTypeChecked.rules,
      "@typescript-eslint/explicit-function-return-type": "off",
      "deprecation/deprecation": "off",
      "etc/no-assign-mutated-array": "off",
      "etc/no-internal": "off",
    },
  },
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["**/*.test.ts?(x)"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "etc/throw-error": "off",
    },
  },
  {
    files: ["**/*.typetest.ts?(x)"],
    rules: {
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-expect-error": false }],
    },
  },
);
