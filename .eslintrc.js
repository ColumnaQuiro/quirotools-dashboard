module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript'
  ],
  // add your custom rules here
  rules: {
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'func-call-spacing': 'off'
  },
  plugins: []
}
