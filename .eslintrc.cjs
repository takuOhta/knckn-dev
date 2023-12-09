module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:astro/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
  ],
  plugins: ['astro', 'vue', '@typescript-eslint', 'storybook'],
  overrides: [
    {
      files: ['*.vue', '*.ts'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        'n/no-callback-literal': ['off'],
        'comma-dangle': ['error', 'always-multiline'],
        'template-curly-spacing': ['error', 'always'],
        'vue/script-indent': ['error', 2, {baseIndent: 0}],
      },
    },
    {
      // or whatever matches stories specified in .storybook/main.js
      files: ['*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
      rules: {
        // example of overriding a rule
        // 'storybook/hierarchy-separator': 'error',
        // example of disabling a rule
        // 'storybook/default-exports': 'off',
      },
    },
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      },
    },
    // ...
  ],
}
