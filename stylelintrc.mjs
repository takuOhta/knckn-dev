const config = {
  extends: [
    'stylelint-config-html/html',
    'stylelint-config-html/vue',
    'stylelint-config-html/astro',
  ],
  rules: {
    'no-duplicate-selectors': true,
  },
}
export default config
