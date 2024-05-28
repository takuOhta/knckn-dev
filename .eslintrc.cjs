/**
 * それぞれのルールについては以下を確認
 * @see https://eslint.org/docs/latest/rules/
 * @see https://typescript-eslint.io/rules/
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['astro', '@typescript-eslint'],
  // ファイルごとにルールを変更・設定する
  overrides: [
    {
      // .ts .astroファイルのみに適用される設定
      files: ['*.ts', '*.astro'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'none',
          },
        ], // 未使用の変数をエラーとする (ただし、型定義のみしたい場合があるので、引数は無視する)
        '@typescript-eslint/no-explicit-any': 'warn', // any型を許可しない
      },
    },
    {
      // .tsファイルのみに適用される設定
      files: ['*.ts'],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        'no-irregular-whitespace': 'off', // 不規則な空白を許可する
      },
    },
    {
      // .astroファイルのみに適用される設定
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // `.astro`ファイル内のスクリプトをTypeScriptとして解析するための設定を追加
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
  ],
}
