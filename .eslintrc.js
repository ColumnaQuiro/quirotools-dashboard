module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  rules: {
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'func-call-spacing': 'off',
    'unused-imports/no-unused-imports': 'error'
  },
  plugins: ['unused-imports']
}
