import { ChevronDown, type LucideIcon, Menu } from 'lucide-react';
import { useState } from 'react';
import { GlobalNav } from '@/components/layout/global-nav';

type AppBarProps = {
  title: string;
  /** タイトル右の設備セレクト表示（例: B-5）。 */
  unit?: string;
  /** ハンバーガー左に並べる装飾アイコン（タイムライン用）。 */
  extraIcons?: LucideIcon[];
};

/** 各画面共通の上部ツールバー。ハンバーガーからグローバルナビを開く。 */
export function AppBar({ title, unit = 'B-5', extraIcons = [] }: AppBarProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <div className="flex h-14 items-center gap-4 bg-[#d1d5db] px-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="font-bold text-[#1f2937] text-base">{title}</span>
          <button
            type="button"
            className="flex items-center gap-1 text-[#374151] text-base"
          >
            {unit}
            <ChevronDown className="size-3" />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          {extraIcons.map((Icon) => (
            <span
              key={Icon.displayName ?? Icon.name}
              className="flex size-9 items-center justify-center text-[#1f2937]"
            >
              <Icon className="size-5" />
            </span>
          ))}
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-[#1f2937]"
            aria-label="メニュー"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <GlobalNav open={navOpen} onOpenChange={setNavOpen} />
    </>
  );
}
