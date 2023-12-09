## 🚀 ディレクトリ構造

ディレクトリ構造は以下の通りです。

```
/
├── dist/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/ → 圧縮が必要な外部リソース
│   │   └── images/
│   ├── components/
│   │   ├── Blocks/ → セクションなどのラッパー
│   │   ├── Buttons/ → ボタンUI
│   │   ├── Elements/ → video・inputタグなどhtml要素
│   │   ├── Footers/ → フッター
│   │   ├── Headers/ → ヘッダー（グローバルナビ含む）
│   │   ├── Links/ → ボタンUI以外のリンクUI
│   │   ├── Navis/ → ページ内ナビゲーションなど
│   │   ├── Overlays/ → モーダルなどページに被さるもの
│   │   ├── Pages/ → ページ固有のUI
│   │   ├── SmoothScrolls/ → 慣性スクロール処理
│   │   └── Titles/ → 見出し要素
│   ├── constants/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── scripts/ → コンポーネント以外の共通で利用するscript
│   │   ├── events/
│   │   ├── motion/
│   │   └── SmoothScroll/
│   ├── styles/ → コンポーネント以外の共通で利用するスタイル
│   │   ├── abstracts/
│   │   ├── foundation/
│   │   ├── global/
│   │   └── typography/ → 見出しや本文などテキストに関するスタイル
│   ├── types/
│   ├── constants/
│   └── utils/ → 再利用できるscriptの関数
└── package.json
```

## VSCodeの設定について

以下の拡張機能の追加をしてください。参考は[こちら](https://future-architect.github.io/articles/20200828/)。

- [astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

## 🧞 コマンド

※Astroのデフォルトで用意されているコマンドです。`yarn run preview`以降は動作検証してません。

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `yarn install`             | Installs dependencies                            |
| `yarn run dev`             | Starts local dev server at `localhost:4321`      |
| `yarn run create:component` | Create a new component (`.vue`, `.stories.ts`)  |
| `yarn run build-staging`   | Build your staging site to `./dist/`             |
| `yarn run build`           | Build your production site to `./dist/`          |
| `yarn run preview`         | Preview your build locally, before deploying     |
| `yarn run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn run astro -- --help` | Get help using the Astro CLI                     |

<!-- ## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat). -->

## 🧞 その他のコマンド

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `yarn run create:component` | Create a new component (`.vue`, `.stories.ts`)  |

## 環境変数について

ローカル開発・ステージング用のビルド・本番用のビルドに使用する環境変数ファイルをリポジトリ直下に設定してください。
ファイルの中身はPJに聞いいてください。

- .env.local : ローカル開発用
- .env.staging : ステージングビルド用
- .env.production : 本番ビルド用
