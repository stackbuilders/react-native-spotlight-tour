module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ["error", 2],
    "max-len": ["warn", 120],
    "no-console": "error",
    quotes: ["error", "double"],
    "@typescript-eslint/no-unused-vars": "off",
  }
};
