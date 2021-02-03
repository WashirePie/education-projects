module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/typescript/recommended',
    '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'nonblock-statement-body-position': ['error', 'below'],
    'brace-style': ['error', 'allman'],
    curly: 'off',
    'vue/require-valid-default-prop': 'off',
    'no-unreachable': 'off',
    'no-prototype-builtins': 'off',
    'no-return-assign': 'off',
    'space-before-function-paren': 'off',
    eqeqeq: 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
