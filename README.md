# Designer Prototype

デザイナーが Claude Code と一緒に画面プロトタイプを作るためのテンプレートです。

React + Vite + Tailwind CSS + shadcn/ui がセットアップ済みなので、`npm install` → `npm run dev` で開発サーバが立ち上がります。

## クイックスタート

新しいプロトタイプを始めるときは、その都度 clone して使います（clone した時点で最新になります）。

```bash
# 1. リポジトリを clone
git clone cm1@cm1.git.backlog.jp:/MBT_TASK/designer-prototype-starter.git
cd designer-prototype-starter

# 2. 依存をインストール
npm install

# 3. 開発サーバ起動（ブラウザが自動で開きます）
npm run dev
```

## 画面を編集する

| やりたいこと | 触る場所 |
| --- | --- |
| ホーム画面の中身を変える | `src/pages/home.tsx` |
| 新しい画面を追加する | `src/pages/` にファイルを追加 → `src/App.tsx` にルートを追加 |
| ヘッダーやナビを変える | `src/components/layout/app-shell.tsx` |
| 色やフォントを変える | `src/index.css` |

`@/foo` は `src/foo` の短縮です（例: `@/components/ui/button` = `src/components/ui/button`）。

## shadcn コンポーネントを追加する

Claude Code に **「shadcn の dialog を使いたい」** と話しかければ、自動的に追加から組み込みまでやってくれます。

自分でコマンドを叩くときは：

```bash
npx shadcn@latest add <コンポーネント名>
# 例
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add input
```

追加されたファイルは `src/components/ui/` に入ります。

コンポーネント一覧: <https://ui.shadcn.com/docs/components>

## Claude Code への話しかけ方の例

- 「ホーム画面に hero セクションを追加して」
- 「shadcn の dialog を使って削除確認ダイアログを出して」
- 「shadcn の dropdown-menu を使ってヘッダーにユーザーメニューを追加して」
- 「全体の雰囲気をもう少し暖色寄りにして」
- 「設定画面を作って `/settings` でアクセスできるようにして」

## スクリプト一覧

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバ起動（ブラウザ自動オープン） |
| `npm run build` | 本番ビルド |
| `npm run preview` | ビルド結果をプレビュー |
| `npm run type-check` | TypeScript 型チェック |
| `npm run lint` | Biome で lint |
| `npm run format` | Biome でフォーマット |

## 採用ライブラリ早見表

| カテゴリ | ライブラリ |
| --- | --- |
| UI フレームワーク | React 19 |
| ビルドツール | Vite |
| 型システム | TypeScript |
| スタイル | Tailwind CSS v4 |
| UI コンポーネント | shadcn/ui（base-vega スタイル、Base UI primitive） |
| アイコン | lucide-react |
| ルーティング | react-router v7 |
| Lint / Format | Biome |
