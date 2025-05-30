// @ts-check
import eslintJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import * as importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import perfectionist from "eslint-plugin-perfectionist";
import reactPlugin from "eslint-plugin-react";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import eslintTs from "typescript-eslint";

const project = "./tsconfig.json";

/**
 * @param {object} config the plugin config
 * @returns {import("typescript-eslint").ConfigWithExtends}
 */
function fixConfigTypes(config) {
  return config;
}

export default eslintTs.config(
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommendedTypeChecked,
  fixConfigTypes(importPlugin.flatConfigs?.typescript),
  fixConfigTypes(reactPlugin.configs.flat?.recommended),
  fixConfigTypes(reactPlugin.configs.flat?.["jsx-runtime"]),
  sonarjs.configs.recommended,
  stylistic.configs.customize({
    braceStyle: "1tbs",
    quotes: "double",
    semi: true,
  }),
  {
    ignores: [
      ".yarn/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "**/.bundle/**",
      "**/android/**",
      "**/build/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/ios/**",
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
      import: importPlugin,
      jsdoc,
      perfectionist,
    },
    settings: {
      "import/ignore": ["node_modules/react-native/.+\\.js$"],
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
      "@stylistic/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
      "@stylistic/padded-blocks": ["error", "never", { allowSingleLineBlocks: false }],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": ["error", "double", {
        allowTemplateLiterals: false,
        avoidEscape: true,
      }],
      "@stylistic/space-before-function-paren": ["error", { anonymous: "never", named: "never" }],
      "@stylistic/switch-colon-spacing": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
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
      camelcase: "error",
      "constructor-super": "error",
      curly: "error",
      eqeqeq: "error",
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
      "import/no-namespace": ["error", { ignore: ["eslint-plugin-import"] }],
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
      "perfectionist/sort-interfaces": ["error", { ignoreCase: false, type: "natural" }],
      "perfectionist/sort-intersection-types": ["error", { ignoreCase: false, type: "natural" }],
      "perfectionist/sort-object-types": ["error", { ignoreCase: false, type: "natural" }],
      "perfectionist/sort-objects": ["error", { ignoreCase: false, type: "natural" }],
      "perfectionist/sort-union-types": ["error", { ignoreCase: false, type: "natural" }],
      "prefer-const": "error",
      radix: "error",
      "react/display-name": "off",
      "react/hook-use-state": "error",
      "react/jsx-boolean-value": ["error", "always"],
      "react/jsx-no-bind": "error",
      "react/jsx-no-literals": "error",
      "react/prop-types": "off",
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/different-types-comparison": "off",
      "sonarjs/function-return-type": "off",
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/no-extend-native": "off",
      "sonarjs/no-nested-functions": "off",
      "sonarjs/no-selector-parameter": "off",
      "sonarjs/no-unused-expressions": "off",
      "sonarjs/prefer-read-only-props": "off",
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
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
    },
  },
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    files: ["**/*.test.ts?(x)"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "sonarjs/assertions-in-tests": "off",
      "sonarjs/no-empty-test-file": "off",
      "sonarjs/no-nested-functions": "off",
    },
  },
);
