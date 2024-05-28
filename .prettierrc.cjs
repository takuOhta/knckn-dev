// @ts-check

/** @type {import('prettier').Options} */
module.exports = {
  printWidth: 1024,
  Tabs: false, // インデントにタブを使用しない
  tabWidth: 2, // インデント幅
  semi: false, // セミコロンを常に省略する
  singleQuote: true, // シングルクォートを常に使用する
  bracketSpacing: true, // オブジェクトの{}の中にスペースを常に入れる
  plugins: ['prettier-plugin-astro'], // AstroファイルをPrettierでフォーマットするためのプラグインを追加
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
