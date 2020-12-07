module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'standard-with-typescript'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    project: ['tsconfig.json'],
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/semi": ["warn", "always"],
    "@typescript-eslint/array-type": ["warn", {default: "array"}],
    "@typescript-eslint/member-delimiter-style": ["warn", {multiline: {delimiter: "semi", requireLast: true}}],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": ["warn", {allowArgumentsExplicitlyTypedAsAny: true}]
  }
}
