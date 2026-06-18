import { SparklesIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <Badge variant="secondary" className="w-fit">
          <SparklesIcon />
          プロトタイプ環境
        </Badge>
        <h1 className="font-bold text-4xl tracking-tight">
          デザイナー向けプロトタイプ環境
        </h1>
        <p className="text-base text-muted-foreground">
          Vite + React + Tailwind CSS + shadcn/ui
          のセットアップ済みテンプレート。
          <br />
          Claude Code
          に「この画面を○○に変えて」と話しかけて画面を組み立てていきましょう。
        </p>
        <div className="flex gap-2">
          <a
            href="https://ui.shadcn.com/docs/components"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline">shadcn コンポーネント一覧</Button>
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>画面を追加する</CardTitle>
            <CardDescription>
              src/pages/ に新しいファイルを作り、src/App.tsx
              にルートを書き足します。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Claude Code
            に「設定画面を追加して」と話しかけると、自動的にファイルとルートを整えてくれます。
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>shadcn コンポーネントを足す</CardTitle>
            <CardDescription>
              dialog / select / dropdown など必要な UI を追加できます。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            「shadcn の dialog
            を使って確認ダイアログを出して」と話しかけると、追加から組み込みまでまとめてやってくれます。
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
