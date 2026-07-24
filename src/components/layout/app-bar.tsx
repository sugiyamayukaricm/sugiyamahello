import { ChevronDown, House, Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { GlobalNav } from '@/components/layout/global-nav';

type AppBarProps = {
  title: string;
  /** タイトル右の設備セレクト表示（例: B-5）。 */
  unit?: string;
};

/** MVP 版の上部ツールバー。ホームアイコンとハンバーガー（グローバルナビ）を持つ。 */
export function AppBar({ title, unit = 'B-5' }: AppBarProps) {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

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
          <button
            type="button"
            onClick={() => navigate('/insight')}
            className="flex size-9 items-center justify-center rounded-lg text-[#1f2937]"
            aria-label="ホーム"
          >
            <House className="size-5" />
          </button>
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
