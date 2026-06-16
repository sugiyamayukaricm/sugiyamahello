# CLAUDE.md

このプロジェクトで Claude Code が作業するときに従うガイドライン。

## このプロジェクトの位置づけ

デザイナーが Claude Code に話しかけながら画面を組み立てるための **プロトタイプ環境**。業務アプリではない。動くものを最短で見せることを優先する。本番運用を見据えた過剰な設計（厳格なテスト・状態管理ライブラリの先回り導入など）はしない。

## UI の構築方針（最重要）

**UI は可能な限り shadcn/ui を使用し、組み合わせて表現する。shadcn にないものはこれに限らず、別のライブラリや自作で対応してよい。**

- ボタン・カード・バッジ・ダイアログ・セレクト・テーブルなど、shadcn にある UI はすべて shadcn で組む
- 必要になった時点で **追加許可を求めずに** `npx shadcn@latest add <component>` を実行する
- 例: `dialog`, `dropdown-menu`, `select`, `input`, `label`, `textarea`, `checkbox`, `tooltip`, `popover`, `command`, `calendar`, `table`, `form`, `sheet`, `tabs`, `accordion`, `alert-dialog` ...
- 既存の `src/components/ui/` に同名がある場合は、`base-vega` スタイルに統一するため上書きしてよい
- shadcn に該当コンポーネントが無い場合は、別の手段（自作、別ライブラリ）に進んでよい

コンポーネント一覧: <https://ui.shadcn.com/docs/components>

## 命名規約

| 対象 | 形式 | 例 |
| --- | --- | --- |
| ファイル / ディレクトリ | kebab-case | `settings-page.tsx`, `app-shell.tsx` |
| コンポーネント export | PascalCase | `export function SettingsPage() {}` |
| フック | `use-*.ts` | `use-debounce.ts` |

## ディレクトリ規約

| 種類 | 置き場所 |
| --- | --- |
| 画面 | `src/pages/` |
| shadcn UI | `src/components/ui/` |
| 共通レイアウト | `src/components/layout/` |
| 横断ユーティリティ | `src/lib/` |
| 機能横断のカスタムフック | `src/hooks/`（必要になったら作る） |

1 つのコンポーネントが大きくなったら、`src/components/foo.tsx` を `src/components/foo/index.tsx` + 関連ファイルに分割する。

## インポート規約

- 同じ src 配下のファイルは `@/` エイリアスで読む（`../../` は避ける）
- 型のみの import は `type` キーワードを付ける（`tsconfig` で `verbatimModuleSyntax: true`）

```ts
// Good
import { type ClassValue, clsx } from 'clsx';
import { Button } from '@/components/ui/button';

// Bad
import { ClassValue, clsx } from 'clsx';
import { Button } from '../../components/ui/button';
```

## スタイリング規約

- Tailwind のユーティリティクラスを優先（インラインスタイルは避ける）
- 色は shadcn の標準トークンを使う（`bg-primary`, `text-foreground`, `bg-muted`, `border-border` など）
- クラス順は Biome の `useSortedClasses` が自動整列するので、手で揃える必要はない
- ダークモードは `.dark` クラスで切り替わる（`@custom-variant dark (&:is(.dark *))`）

## ライブラリ追加の方針

| 対応 | ライブラリの例 |
| --- | --- |
| 即追加 OK（許可不要） | shadcn UI 系、`lucide-react` のアイコン、`react-router` のルート定義 |
| 事前にデザイナーへ確認 | フォームライブラリ（`react-hook-form` + `zod`）、状態管理（`zustand`, `jotai` 等）、認証、API クライアント、グラフ描画 |
| 追加しない | Storybook、MSW、TanStack Query、AWS Amplify、Cesium、Leaflet（プロトタイプには重い） |

## Lint / Format

- Biome で統一（ESLint / Prettier は採用しない）
- `console.log` はエラー扱い。一時デバッグで使うときは行頭に `// biome-ignore lint/suspicious/noConsole: debug` を付ける
- 完了報告前に以下が通ることを確認する
  - `npm run type-check`
  - `npm run lint`
  - `npm run dev` を立ち上げて画面が表示される

## 変更前の作法

- 既存の `src/pages/` `src/components/` を読んで、同じパターンがあれば真似る
- 新規コンポーネントを書く前に shadcn にあるか調べる（迷ったら追加して使う）

## ルーティング

- `react-router` v7 を採用
- 画面を追加するときは `src/pages/new-page.tsx` を作り、`src/App.tsx` の `<Routes>` に `<Route path="..." element={<NewPage />} />` を追記する
- `<Link to="...">` で遷移リンクを作る
